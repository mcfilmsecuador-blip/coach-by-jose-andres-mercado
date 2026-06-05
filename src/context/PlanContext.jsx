import { createContext, useState, useEffect, useContext } from 'react';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from './AuthContext';
import { generatePersonalizedPlan } from '../utils/planGenerator';
import { exercisesDb } from '../data/exercisesData';
import { recipesDb } from '../data/recipesData';

const PlanContext = createContext();

export const usePlan = () => {
  const context = useContext(PlanContext);
  if (!context) {
    throw new Error('usePlan must be used within a PlanProvider');
  }
  return context;
};

const getAchievementName = (id) => {
  const mapping = {
    first_workout: "Primera rutina completada",
    streak_3: "3 días seguidos entrenando",
    perfect_week: "Semana perfecta",
    active_month: "Primer mes activo",
    personal_record: "Nuevo récord personal",
    consistency: "Mayor constancia semanal",
    partial_goal: "Objetivo parcial alcanzado",
    strength_gain: "Mejora en fuerza",
    composition_gain: "Mejora en composición corporal"
  };
  return mapping[id] || id;
};

export const PlanProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [activePlan, setActivePlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [latestAchievement, setLatestAchievement] = useState(null);

  const clearLatestAchievement = () => setLatestAchievement(null);

  // Synchronize userProfile with Firestore doc in real-time
  useEffect(() => {
    if (!currentUser) {
      const timer = setTimeout(() => {
        setUserProfile(null);
        setActivePlan(null);
        setLoading(false);
      }, 0);
      return () => clearTimeout(timer);
    }

    setTimeout(() => {
      setLoading(true);
    }, 0);
    const docRef = doc(db, 'users', currentUser.uid);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const profile = docSnap.data();
        
        // Ensure all default fields exist for progress tracking
        if (!profile.weightHistory) {
          profile.weightHistory = [{ date: new Date().toISOString().split('T')[0], weight: profile.weightKg || 78 }];
        }
        if (!profile.measurementsHistory) {
          profile.measurementsHistory = [{
            date: new Date().toISOString().split('T')[0],
            measurements: { neck: 36, chest: 95, waist: 82, biceps: 33, hips: 98, thighs: 56 }
          }];
        }
        if (!profile.completedWorkoutsCount) profile.completedWorkoutsCount = 0;
        if (!profile.completedDays) profile.completedDays = [];
        if (!profile.achievements) profile.achievements = [];
        if (!profile.biologicalSex) profile.biologicalSex = profile.gender === 'female' || profile.gender === 'F' ? 'female' : 'male';
        if (!profile.trainingDaysPerWeek) profile.trainingDaysPerWeek = 4;

        setUserProfile(profile);
      } else {
        // No profile document exists yet for this user
        setUserProfile(null);
      }
      setLoading(false);
    }, (err) => {
      console.error("Error listening to user doc:", err);
      setError("Error al sincronizar tu perfil con la base de datos.");
      setLoading(false);
    });

    return unsubscribe;
  }, [currentUser]);

  // Generate or regenerate plan when userProfile changes
  useEffect(() => {
    if (!userProfile || !userProfile.name) {
      const timer = setTimeout(() => {
        setActivePlan(null);
      }, 0);
      return () => clearTimeout(timer);
    }
    
    const timer = setTimeout(() => {
      try {
        const generated = generatePersonalizedPlan(userProfile);
        
        // Keep custom exercise / meal replacements in activePlan 
        // if core settings did not change.
        if (activePlan) {
          const coreConfigChanged = 
            userProfile.goal !== activePlan.userProfile.goal ||
            userProfile.experienceLevel !== activePlan.userProfile.experienceLevel ||
            userProfile.trainingDaysPerWeek !== activePlan.userProfile.trainingDaysPerWeek ||
            userProfile.equipment !== activePlan.userProfile.equipment ||
            JSON.stringify(userProfile.injuries) !== JSON.stringify(activePlan.userProfile.injuries) ||
            JSON.stringify(userProfile.selectedTrainingDays) !== JSON.stringify(activePlan.userProfile.selectedTrainingDays);

          if (!coreConfigChanged) {
            generated.workoutPlan.schedule = activePlan.workoutPlan.schedule;
            generated.nutritionPlan.weeklyPlan = activePlan.nutritionPlan.weeklyPlan;
            generated.shoppingList = activePlan.shoppingList;
          }
        }
        
        setActivePlan(generated);
      } catch (err) {
        console.error("Error generating plan:", err);
        setError("No se pudo generar el plan. Revisa tus datos e intenta nuevamente.");
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [userProfile]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateProfile = async (updatedFields) => {
    if (!currentUser) return;
    const docRef = doc(db, 'users', currentUser.uid);
    // Merge biologicalSex with gender changes
    if (updatedFields.gender) {
      updatedFields.biologicalSex = updatedFields.gender === 'female' || updatedFields.gender === 'F' ? 'female' : 'male';
    }
    await setDoc(docRef, updatedFields, { merge: true });
  };

  const completeWorkout = async () => {
    if (!currentUser || !userProfile) return;
    const todayStr = new Date().toISOString().split('T')[0];
    const alreadyCompletedToday = userProfile.completedDays?.includes(todayStr);
    const updatedDays = alreadyCompletedToday ? userProfile.completedDays : [...(userProfile.completedDays || []), todayStr];
    const newCount = alreadyCompletedToday ? userProfile.completedWorkoutsCount : ((userProfile.completedWorkoutsCount || 0) + 1);

    // Evaluate achievements
    const updatedAchievements = [...(userProfile.achievements || [])];
    const unlock = (id) => {
      if (!updatedAchievements.includes(id)) {
        updatedAchievements.push(id);
        setTimeout(() => setLatestAchievement(getAchievementName(id)), 0);
      }
    };

    if (newCount >= 1) unlock('first_workout');

    // Streaks (3 days)
    const sortedDays = [...updatedDays].sort();
    let currentStreak = 0;
    if (sortedDays.length > 0) {
      currentStreak = 1;
      for (let i = sortedDays.length - 1; i > 0; i--) {
        const d1 = new Date(sortedDays[i]);
        const d2 = new Date(sortedDays[i-1]);
        const diffTime = Math.abs(d1 - d2);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          currentStreak++;
        } else if (diffDays > 1) {
          break;
        }
      }
    }
    if (currentStreak >= 3) unlock('streak_3');
    if (newCount >= (userProfile.trainingDaysPerWeek || 4)) unlock('perfect_week');
    if (newCount >= 16) unlock('active_month');
    if (newCount >= 8) unlock('consistency');

    const docRef = doc(db, 'users', currentUser.uid);
    await setDoc(docRef, {
      completedWorkoutsCount: newCount,
      completedDays: updatedDays,
      achievements: updatedAchievements
    }, { merge: true });
  };

  const saveWeight = async (newWeight) => {
    if (!currentUser || !userProfile) return;
    const todayStr = new Date().toISOString().split('T')[0];
    const updatedHistory = [...(userProfile.weightHistory || [])];
    const existingIndex = updatedHistory.findIndex(w => w.date === todayStr);
    if (existingIndex >= 0) {
      updatedHistory[existingIndex].weight = Number(newWeight);
    } else {
      updatedHistory.push({ date: todayStr, weight: Number(newWeight) });
    }

    const updatedAchievements = [...(userProfile.achievements || [])];
    const unlock = (id) => {
      if (!updatedAchievements.includes(id)) {
        updatedAchievements.push(id);
        setTimeout(() => setLatestAchievement(getAchievementName(id)), 0);
      }
    };

    const initialW = updatedHistory[0]?.weight || userProfile.weightKg;
    const weightDiff = Math.abs(Number(newWeight) - initialW);
    if (weightDiff >= 2.0) {
      unlock('partial_goal');
      unlock('composition_gain');
    }

    const docRef = doc(db, 'users', currentUser.uid);
    await setDoc(docRef, {
      weightKg: Number(newWeight),
      weightHistory: updatedHistory,
      achievements: updatedAchievements
    }, { merge: true });
  };

  const saveMeasurements = async (newMeas) => {
    if (!currentUser || !userProfile) return;
    const todayStr = new Date().toISOString().split('T')[0];
    const updatedHistory = [...(userProfile.measurementsHistory || [])];
    const existingIndex = updatedHistory.findIndex(m => m.date === todayStr);
    if (existingIndex >= 0) {
      updatedHistory[existingIndex].measurements = newMeas;
    } else {
      updatedHistory.push({ date: todayStr, measurements: newMeas });
    }

    const updatedAchievements = [...(userProfile.achievements || [])];
    const unlock = (id) => {
      if (!updatedAchievements.includes(id)) {
        updatedAchievements.push(id);
        setTimeout(() => setLatestAchievement(getAchievementName(id)), 0);
      }
    };

    unlock('strength_gain');

    const docRef = doc(db, 'users', currentUser.uid);
    await setDoc(docRef, {
      measurementsHistory: updatedHistory,
      achievements: updatedAchievements
    }, { merge: true });
  };

  const toggleShoppingItem = (categoryName, itemIndex) => {
    if (!activePlan) return;
    setActivePlan(prev => {
      const updatedCategories = prev.shoppingList.categories.map(cat => {
        if (cat.name === categoryName) {
          const updatedItems = cat.items.map((item, idx) => {
            if (idx === itemIndex) {
              return { ...item, checked: !item.checked };
            }
            return item;
          });
          return { ...cat, items: updatedItems };
        }
        return cat;
      });

      return {
        ...prev,
        shoppingList: {
          ...prev.shoppingList,
          categories: updatedCategories
        }
      };
    });
  };

  const changeExercise = (workoutDayId, exerciseId) => {
    if (!activePlan) return;
    const workoutDay = activePlan.workoutPlan.schedule.find(w => w.id === workoutDayId);
    if (!workoutDay) return;
    const exercise = workoutDay.exercises.find(e => e.id === exerciseId);
    if (!exercise) return;

    let alternative = null;
    if (exercise.alternatives && exercise.alternatives.length > 0) {
      const altId = exercise.alternatives[0];
      alternative = exercisesDb.find(ex => ex.id === altId);
    }

    if (!alternative) {
      alternative = exercisesDb.find(ex => ex.mainMuscle === exercise.mainMuscle && ex.id !== exerciseId);
    }

    if (!alternative) return;

    const updatedAlternative = {
      ...alternative,
      sets: exercise.sets,
      reps: exercise.reps,
      restSeconds: exercise.restSeconds,
      rpe: exercise.rpe,
      tempo: exercise.tempo
    };

    setActivePlan(prev => {
      const updatedSchedule = prev.workoutPlan.schedule.map(w => {
        if (w.id === workoutDayId) {
          const updatedExercises = w.exercises.map(e => {
            if (e.id === exerciseId) {
              return updatedAlternative;
            }
            return e;
          });
          return { ...w, exercises: updatedExercises };
        }
        return w;
      });

      return {
        ...prev,
        workoutPlan: {
          ...prev.workoutPlan,
          schedule: updatedSchedule
        }
      };
    });
  };

  const reportPain = (workoutDayId, exerciseId) => {
    if (!activePlan) return;
    changeExercise(workoutDayId, exerciseId);

    setActivePlan(prev => {
      const updatedSchedule = prev.workoutPlan.schedule.map(w => {
        if (w.id === workoutDayId) {
          const hasSafetyWarning = w.safetyNotes.some(n => n.includes("DOLOR REPORTADO"));
          const updatedNotes = hasSafetyWarning 
            ? w.safetyNotes 
            : [
                ...w.safetyNotes,
                `⚠️ DOLOR REPORTADO en ${exerciseId}: Se ha cambiado el ejercicio por uno alternativo. No aumentes cargas y mantén movimientos lentos y controlados.`
              ];
          return { ...w, safetyNotes: updatedNotes };
        }
        return w;
      });

      return {
        ...prev,
        workoutPlan: {
          ...prev.workoutPlan,
          schedule: updatedSchedule
        }
      };
    });
  };

  const substituteMeal = (dayName, mealKey) => {
    if (!activePlan) return;

    const dayPlan = activePlan.nutritionPlan.weeklyPlan.find(d => d.day === dayName);
    if (!dayPlan) return;
    const currentMeal = dayPlan.meals[mealKey];
    if (!currentMeal || !currentMeal.recipe) return;

    const userGoal = activePlan.userProfile.goal || 'mejorar_salud';
    let alternatives = recipesDb.filter(r => 
      r.mealType === currentMeal.recipe.mealType && 
      r.id !== currentMeal.recipe.id &&
      r.goal.includes(userGoal)
    );

    if (alternatives.length === 0) {
      alternatives = recipesDb.filter(r => r.mealType === currentMeal.recipe.mealType && r.id !== currentMeal.recipe.id);
    }

    if (alternatives.length === 0) return;

    const newRecipe = alternatives[Math.floor(Math.random() * alternatives.length)];

    setActivePlan(prev => {
      const updatedWeeklyPlan = prev.nutritionPlan.weeklyPlan.map(d => {
        if (d.day === dayName) {
          const updatedMeals = {
            ...d.meals,
            [mealKey]: {
              ...d.meals[mealKey],
              recipe: newRecipe
            }
          };
          return { ...d, meals: updatedMeals };
        }
        return d;
      });

      return {
        ...prev,
        nutritionPlan: {
          ...prev.nutritionPlan,
          weeklyPlan: updatedWeeklyPlan
        }
      };
    });
  };

  const swapWithCustomExercise = (workoutDayId, exerciseId, newExercise) => {
    if (!activePlan) return;
    
    const workoutDay = activePlan.workoutPlan.schedule.find(w => w.id === workoutDayId);
    if (!workoutDay) return;
    const exercise = workoutDay.exercises.find(e => e.id === exerciseId);
    if (!exercise) return;

    const updatedExercise = {
      ...newExercise,
      sets: exercise.sets,
      reps: exercise.reps,
      restSeconds: exercise.restSeconds,
      rpe: exercise.rpe,
      tempo: exercise.tempo
    };

    setActivePlan(prev => {
      const updatedSchedule = prev.workoutPlan.schedule.map(w => {
        if (w.id === workoutDayId) {
          const updatedExercises = w.exercises.map(e => {
            if (e.id === exerciseId) {
              return updatedExercise;
            }
            return e;
          });
          return { ...w, exercises: updatedExercises };
        }
        return w;
      });

      return {
        ...prev,
        workoutPlan: {
          ...prev.workoutPlan,
          schedule: updatedSchedule
        }
      };
    });
  };

  const addExtraRoutine = async (routineData) => {
    if (!currentUser || !userProfile) return;
    const extraWorkouts = userProfile.extraWorkouts || [];
    
    const resolvedExercises = routineData.exercises.map((exName) => {
      let ex = exercisesDb.find(e => e.name.toLowerCase() === exName.toLowerCase());
      if (!ex) {
        ex = exercisesDb.find(e => e.name.toLowerCase().includes(exName.toLowerCase())) || exercisesDb[0];
      }
      return {
        ...ex,
        sets: 4,
        reps: "10-12",
        restSeconds: 90,
        rpe: 8,
        tempo: "3-1-1-0"
      };
    });

    const mainMuscles = [...new Set(resolvedExercises.map(e => e.mainMuscle))];

    const newRoutine = {
      id: `extra_${Date.now()}`,
      title: routineData.name || "Rutina Extra AI",
      day: "extra",
      focus: mainMuscles.join(', '),
      durationMin: resolvedExercises.length * 10,
      mainMuscles: mainMuscles,
      exercises: resolvedExercises,
      safetyNotes: ["Rutina personalizada generada por Coach AI. Cuida la técnica."]
    };

    const docRef = doc(db, 'users', currentUser.uid);
    await setDoc(docRef, {
      extraWorkouts: [...extraWorkouts, newRoutine]
    }, { merge: true });
  };

  const deleteExtraRoutine = async (routineId) => {
    if (!currentUser || !userProfile) return;
    const extraWorkouts = userProfile.extraWorkouts || [];
    const updatedExtra = extraWorkouts.filter(w => w.id !== routineId);

    const docRef = doc(db, 'users', currentUser.uid);
    await setDoc(docRef, {
      extraWorkouts: updatedExtra
    }, { merge: true });
  };

  return (
    <PlanContext.Provider
      value={{
        userProfile,
        activePlan,
        loading,
        error,
        latestAchievement,
        clearLatestAchievement,
        updateProfile,
        toggleShoppingItem,
        changeExercise,
        swapWithCustomExercise,
        reportPain,
        substituteMeal,
        completeWorkout,
        saveWeight,
        saveMeasurements,
        addExtraRoutine,
        deleteExtraRoutine
      }}
    >
      {children}
    </PlanContext.Provider>
  );
};
