import { exercisesDb } from '../data/exercisesData.js';
import { recipesDb } from '../data/recipesData.js';

/**
 * Generates a fully personalized Workout & Nutrition Plan based on a user's profile.
 * @param {Object} userProfile 
 */
export function generatePersonalizedPlan(userProfile) {
  const workoutPlan = generateWorkoutPlan(userProfile);
  const nutritionPlan = generateNutritionPlan(userProfile, workoutPlan);
  const shoppingList = generateShoppingList(nutritionPlan, userProfile);

  return {
    userProfile,
    workoutPlan,
    nutritionPlan,
    shoppingList
  };
}

/**
 * 1. WORKOUT PLAN GENERATOR
 */
function generateWorkoutPlan(profile) {
  const {
    goal = "ganar_musculo",
    experienceLevel = "intermedio",
    selectedTrainingDays = ["lunes", "miércoles", "viernes", "sábado"],
    equipment = "gimnasio_completo",
    injuries = [],
    biologicalSex = "male"
  } = profile;

  // Filter exercises compatible with equipment and injuries
  const availableExercises = exercisesDb.filter(ex => {
    // Equipment filter
    const equip = equipment ? equipment.toLowerCase() : "";
    if (equip === "casa_sin_equipo" || equip === "casa sin equipo") {
      if (ex.equipment !== "peso_corporal") return false;
    } else if (equip === "casa_con_mancuernas" || equip === "casa con mancuernas") {
      if (ex.equipment !== "mancuernas" && ex.equipment !== "peso_corporal") return false;
    } else if (equip === "bandas_elasticas" || equip === "bandas elásticas") {
      if (ex.equipment !== "bandas" && ex.equipment !== "peso_corporal") return false;
    }

    // Injury filter
    if (injuries && injuries.length > 0) {
      const activeInjuries = injuries.map(i => i.toLowerCase());
      if (activeInjuries.some(i => i.includes("rodilla")) && 
          (ex.id === "sentadilla_libre" || ex.id === "prensa_piernas" || ex.name.toLowerCase().includes("sentadilla") || ex.name.toLowerCase().includes("prensa") || ex.name.toLowerCase().includes("zancada"))) {
        return false;
      }
      if (activeInjuries.some(i => i.includes("espalda") || i.includes("lumbar")) && 
          (ex.id === "deadlift" || ex.id === "remo_barra" || ex.id === "peso_muerto_rumano" || ex.name.toLowerCase().includes("peso muerto") || ex.name.toLowerCase().includes("remo con barra"))) {
        return false;
      }
      if (activeInjuries.some(i => i.includes("hombro")) && 
          (ex.id === "press_militar" || ex.id === "fondos_paralelas" || ex.name.toLowerCase().includes("militar") || ex.name.toLowerCase().includes("fondos"))) {
        return false;
      }
    }
    return true;
  });

  const formatExercise = (exercise) => {
    let sets = 3;
    let reps = "10";
    let restSeconds = 90;
    let rpe = 7;
    let tempo = "2-0-2";

    if (experienceLevel === "principiante") {
      sets = 3;
      reps = "10-12";
      restSeconds = 90;
      rpe = 7;
      tempo = "2-1-1";
    } else if (experienceLevel === "intermedio") {
      sets = 4;
      reps = "8-10";
      restSeconds = 90;
      rpe = 8;
      tempo = "2-1-1";
    } else if (experienceLevel === "avanzado") {
      sets = 4;
      reps = "6-8";
      restSeconds = 120;
      rpe = 9;
      tempo = "3-1-1";
    }

    if (exercise.category === "core") {
      reps = "30-40 seg";
      restSeconds = 60;
      rpe = 8;
    } else if (exercise.category === "cardio") {
      reps = "10-15 min";
      restSeconds = 0;
      rpe = 6;
    }

    return {
      ...exercise,
      sets,
      reps,
      restSeconds,
      rpe,
      tempo
    };
  };

  const getExercisesForMuscle = (muscleName, count = 1) => {
    let list = availableExercises.filter(ex => ex.mainMuscle === muscleName);
    if (list.length === 0) {
      list = availableExercises.filter(ex => ex.secondaryMuscles && ex.secondaryMuscles.includes(muscleName));
    }
    if (list.length === 0) {
      list = availableExercises.filter(ex => ex.category === "fuerza");
    }
    if (list.length === 0) {
      list = exercisesDb;
    }

    const selected = [];
    const temp = [...list];
    for (let i = 0; i < count; i++) {
      if (temp.length === 0) break;
      const idx = Math.floor(Math.random() * temp.length);
      const ex = temp.splice(idx, 1)[0];
      selected.push(formatExercise(ex));
    }
    return selected;
  };

  const getCardioExercise = () => {
    const list = availableExercises.filter(ex => ex.category === "cardio");
    const base = list.length > 0 ? list : exercisesDb.filter(ex => ex.category === "cardio");
    return formatExercise(base[Math.floor(Math.random() * base.length)] || exercisesDb[0]);
  };

  const getCoreExercise = () => {
    const list = availableExercises.filter(ex => ex.category === "core");
    const base = list.length > 0 ? list : exercisesDb.filter(ex => ex.category === "core");
    return formatExercise(base[Math.floor(Math.random() * base.length)] || exercisesDb[0]);
  };

  const totalDays = selectedTrainingDays.length;
  const schedule = [];

  const isFemale = biologicalSex === "female" || biologicalSex === "F";

  // Build routines based on splits
  if (totalDays <= 2) {
    // 2 DAYS: Full Body A & B
    // Gender adjustments: female gets more leg/glute, male gets more upper.
    const fbaMuscles = isFemale 
      ? ["Glúteos", "Cuádriceps", "Espalda", "Pecho"] 
      : ["Pecho", "Espalda", "Cuádriceps", "Hombros"];
    const fbbMuscles = isFemale 
      ? ["Isquiotibiales", "Glúteos", "Hombros", "Abdomen/Core"] 
      : ["Espalda", "Bíceps", "Tríceps", "Isquiotibiales"];

    const fbaExs = [
      ...getExercisesForMuscle(fbaMuscles[0], 2),
      ...getExercisesForMuscle(fbaMuscles[1], 1),
      ...getExercisesForMuscle(fbaMuscles[2], 1),
      ...getExercisesForMuscle(fbaMuscles[3], 1),
      getCoreExercise(),
      getCardioExercise()
    ];

    const fbbExs = [
      ...getExercisesForMuscle(fbbMuscles[0], 2),
      ...getExercisesForMuscle(fbbMuscles[1], 1),
      ...getExercisesForMuscle(fbbMuscles[2], 1),
      ...getExercisesForMuscle(fbbMuscles[3], 1),
      getCoreExercise()
    ];

    schedule.push(
      createWorkoutDay(selectedTrainingDays[0], "Full Body A", "media", fbaMuscles, fbaExs, profile),
      createWorkoutDay(selectedTrainingDays[1] || "jueves", "Full Body B", "media", fbbMuscles, fbbExs, profile)
    );

  } else if (totalDays === 3) {
    // 3 DAYS: Custom splits
    if (isFemale) {
      // Female: Lower body priority
      // Day 1: Inferior A (Glúteos, Femorales)
      // Day 2: Superior & Core (Espalda, Pecho, Hombros)
      // Day 3: Inferior B (Cuádriceps, Abductores, Pantorrillas)
      const day1Exs = [
        ...getExercisesForMuscle("Glúteos", 2),
        ...getExercisesForMuscle("Isquiotibiales", 2),
        getCoreExercise()
      ];
      const day2Exs = [
        ...getExercisesForMuscle("Espalda", 1),
        ...getExercisesForMuscle("Hombros", 1),
        ...getExercisesForMuscle("Pecho", 1),
        ...getExercisesForMuscle("Bíceps", 1),
        getCoreExercise(),
        getCardioExercise()
      ];
      const day3Exs = [
        ...getExercisesForMuscle("Cuádriceps", 2),
        ...getExercisesForMuscle("Glúteos", 1),
        ...getExercisesForMuscle("Pantorrillas", 1),
        getCoreExercise()
      ];

      schedule.push(
        createWorkoutDay(selectedTrainingDays[0], "Tren Inferior A (Cadera y Femorales)", "alta", ["Glúteos", "Isquiotibiales"], day1Exs, profile),
        createWorkoutDay(selectedTrainingDays[1], "Tren Superior y Core", "media", ["Espalda", "Hombros", "Pecho", "Abdomen/Core"], day2Exs, profile),
        createWorkoutDay(selectedTrainingDays[2], "Tren Inferior B (Cuádriceps y Glúteos)", "alta", ["Cuádriceps", "Glúteos", "Pantorrillas"], day3Exs, profile)
      );
    } else {
      // Male: Upper body priority (Push / Pull / Legs)
      // Day 1: Empuje (Pecho, Hombros, Tríceps)
      // Day 2: Tracción & Core (Espalda, Bíceps, Core)
      // Day 3: Piernas completas (Glúteos, Cuádriceps, Femorales, Pantorrillas)
      const pushExs = [
        ...getExercisesForMuscle("Pecho", 2),
        ...getExercisesForMuscle("Hombros", 2),
        ...getExercisesForMuscle("Tríceps", 1),
        getCoreExercise()
      ];
      const pullExs = [
        ...getExercisesForMuscle("Espalda", 3),
        ...getExercisesForMuscle("Bíceps", 2),
        getCoreExercise()
      ];
      const legsExs = [
        ...getExercisesForMuscle("Cuádriceps", 2),
        ...getExercisesForMuscle("Isquiotibiales", 1),
        ...getExercisesForMuscle("Glúteos", 1),
        ...getExercisesForMuscle("Pantorrillas", 1),
        getCardioExercise()
      ];

      schedule.push(
        createWorkoutDay(selectedTrainingDays[0], "Día de Empuje (Push)", "alta", ["Pecho", "Hombros", "Tríceps"], pushExs, profile),
        createWorkoutDay(selectedTrainingDays[1], "Día de Tracción y Core (Pull)", "alta", ["Espalda", "Bíceps", "Abdomen/Core"], pullExs, profile),
        createWorkoutDay(selectedTrainingDays[2], "Día de Piernas (Legs)", "alta", ["Cuádriceps", "Isquiotibiales", "Glúteos", "Pantorrillas"], legsExs, profile)
      );
    }
  } else if (totalDays === 4) {
    // 4 DAYS: Torso / Pierna A & B
    if (isFemale) {
      // Female Torso/Piernas (Leg Days focus on lower body volume)
      schedule.push(
        createWorkoutDay(selectedTrainingDays[0], "Piernas A (Enfoque Glúteos)", "alta", ["Glúteos", "Isquiotibiales"], [
          ...getExercisesForMuscle("Glúteos", 3),
          ...getExercisesForMuscle("Isquiotibiales", 2),
          getCoreExercise()
        ], profile),
        createWorkoutDay(selectedTrainingDays[1], "Torso A (Tonificación)", "media", ["Espalda", "Pecho", "Hombros"], [
          ...getExercisesForMuscle("Espalda", 2),
          ...getExercisesForMuscle("Pecho", 1),
          ...getExercisesForMuscle("Hombros", 2),
          getCardioExercise()
        ], profile),
        createWorkoutDay(selectedTrainingDays[2], "Piernas B (Cuádriceps y Glúteos)", "alta", ["Cuádriceps", "Glúteos", "Pantorrillas"], [
          ...getExercisesForMuscle("Cuádriceps", 2),
          ...getExercisesForMuscle("Glúteos", 2),
          ...getExercisesForMuscle("Pantorrillas", 1),
          getCoreExercise()
        ], profile),
        createWorkoutDay(selectedTrainingDays[3], "Torso B + Core y Cardio", "media-alta", ["Espalda", "Brazos", "Cardio"], [
          ...getExercisesForMuscle("Espalda", 1),
          ...getExercisesForMuscle("Bíceps", 1),
          ...getExercisesForMuscle("Tríceps", 1),
          getCoreExercise(),
          getCardioExercise()
        ], profile)
      );
    } else {
      // Male Torso/Piernas (Torso Days focus on upper body volume)
      schedule.push(
        createWorkoutDay(selectedTrainingDays[0], "Torso A (Pecho y Espalda)", "alta", ["Pecho", "Espalda"], [
          ...getExercisesForMuscle("Pecho", 3),
          ...getExercisesForMuscle("Espalda", 2),
          getCoreExercise()
        ], profile),
        createWorkoutDay(selectedTrainingDays[1], "Piernas A (Fuerza y Potencia)", "alta", ["Cuádriceps", "Isquiotibiales", "Pantorrillas"], [
          ...getExercisesForMuscle("Cuádriceps", 2),
          ...getExercisesForMuscle("Isquiotibiales", 2),
          ...getExercisesForMuscle("Glúteos", 1),
          getCoreExercise()
        ], profile),
        createWorkoutDay(selectedTrainingDays[2], "Torso B (Hombros y Brazos)", "alta", ["Hombros", "Bíceps", "Tríceps"], [
          ...getExercisesForMuscle("Hombros", 2),
          ...getExercisesForMuscle("Bíceps", 2),
          ...getExercisesForMuscle("Tríceps", 2),
          getCardioExercise()
        ], profile),
        createWorkoutDay(selectedTrainingDays[3], "Piernas B + Core", "media-alta", ["Glúteos", "Cuádriceps", "Abdomen/Core"], [
          ...getExercisesForMuscle("Glúteos", 2),
          ...getExercisesForMuscle("Cuádriceps", 1),
          ...getExercisesForMuscle("Pantorrillas", 1),
          getCoreExercise(),
          getCardioExercise()
        ], profile)
      );
    }
  } else if (totalDays === 5) {
    // 5 DAYS: PPL + Torso/Piernas
    if (isFemale) {
      schedule.push(
        createWorkoutDay(selectedTrainingDays[0], "Tren Inferior (Glúteos & Femorales)", "alta", ["Glúteos", "Isquiotibiales"], [
          ...getExercisesForMuscle("Glúteos", 3),
          ...getExercisesForMuscle("Isquiotibiales", 2),
          getCoreExercise()
        ], profile),
        createWorkoutDay(selectedTrainingDays[1], "Torso A (Espalda y Hombros)", "media", ["Espalda", "Hombros"], [
          ...getExercisesForMuscle("Espalda", 2),
          ...getExercisesForMuscle("Hombros", 2),
          getCardioExercise()
        ], profile),
        createWorkoutDay(selectedTrainingDays[2], "Tren Inferior (Cuádriceps & Femorales)", "alta", ["Cuádriceps", "Isquiotibiales"], [
          ...getExercisesForMuscle("Cuádriceps", 2),
          ...getExercisesForMuscle("Isquiotibiales", 2),
          getCoreExercise()
        ], profile),
        createWorkoutDay(selectedTrainingDays[3], "Torso B + Brazos & Core", "media", ["Pecho", "Bíceps", "Tríceps"], [
          ...getExercisesForMuscle("Pecho", 1),
          ...getExercisesForMuscle("Bíceps", 2),
          ...getExercisesForMuscle("Tríceps", 1),
          getCoreExercise()
        ], profile),
        createWorkoutDay(selectedTrainingDays[4], "Glúteos e Isquiotibiales + Cardio", "alta", ["Glúteos", "Isquiotibiales", "Cardio"], [
          ...getExercisesForMuscle("Glúteos", 2),
          ...getExercisesForMuscle("Isquiotibiales", 1),
          getCardioExercise(),
          getCoreExercise()
        ], profile)
      );
    } else {
      schedule.push(
        createWorkoutDay(selectedTrainingDays[0], "Empuje (Pecho, Hombros, Tríceps)", "alta", ["Pecho", "Hombros", "Tríceps"], [
          ...getExercisesForMuscle("Pecho", 2),
          ...getExercisesForMuscle("Hombros", 2),
          ...getExercisesForMuscle("Tríceps", 1),
          getCoreExercise()
        ], profile),
        createWorkoutDay(selectedTrainingDays[1], "Tracción (Espalda, Bíceps)", "alta", ["Espalda", "Bíceps"], [
          ...getExercisesForMuscle("Espalda", 3),
          ...getExercisesForMuscle("Bíceps", 2),
          getCoreExercise()
        ], profile),
        createWorkoutDay(selectedTrainingDays[2], "Piernas (Cuádriceps, Femorales, Pantorrillas)", "alta", ["Cuádriceps", "Isquiotibiales", "Pantorrillas"], [
          ...getExercisesForMuscle("Cuádriceps", 2),
          ...getExercisesForMuscle("Isquiotibiales", 2),
          ...getExercisesForMuscle("Glúteos", 1),
          getCoreExercise()
        ], profile),
        createWorkoutDay(selectedTrainingDays[3], "Torso (Pecho y Espalda)", "alta", ["Pecho", "Espalda"], [
          ...getExercisesForMuscle("Pecho", 2),
          ...getExercisesForMuscle("Espalda", 2),
          getCardioExercise()
        ], profile),
        createWorkoutDay(selectedTrainingDays[4], "Brazos, Core y Cardio", "media-alta", ["Bíceps", "Tríceps", "Cardio"], [
          ...getExercisesForMuscle("Bíceps", 2),
          ...getExercisesForMuscle("Tríceps", 2),
          getCoreExercise(),
          getCardioExercise()
        ], profile)
      );
    }
  } else {
    // 6 DAYS: Push / Pull / Legs x 2
    schedule.push(
      createWorkoutDay(selectedTrainingDays[0], "Empuje A (Pecho Fuerte)", "alta", ["Pecho", "Hombros", "Tríceps"], [
        ...getExercisesForMuscle("Pecho", 3),
        ...getExercisesForMuscle("Hombros", 1),
        ...getExercisesForMuscle("Tríceps", 1),
        getCoreExercise()
      ], profile),
      createWorkoutDay(selectedTrainingDays[1], "Tracción A (Espalda Ancha)", "alta", ["Espalda", "Bíceps", "Core"], [
        ...getExercisesForMuscle("Espalda", 3),
        ...getExercisesForMuscle("Bíceps", 2),
        getCoreExercise()
      ], profile),
      createWorkoutDay(selectedTrainingDays[2], "Piernas A (Cadera y Cadena Posterior)", "alta", isFemale ? ["Glúteos", "Isquiotibiales"] : ["Cuádriceps", "Isquiotibiales"], [
        ...getExercisesForMuscle(isFemale ? "Glúteos" : "Cuádriceps", 3),
        ...getExercisesForMuscle("Isquiotibiales", 2),
        ...getExercisesForMuscle("Pantorrillas", 1)
      ], profile),
      createWorkoutDay(selectedTrainingDays[3], "Empuje B (Hombros & Brazos)", "alta", ["Hombros", "Pecho", "Tríceps"], [
        ...getExercisesForMuscle("Hombros", 3),
        ...getExercisesForMuscle("Pecho", 1),
        ...getExercisesForMuscle("Tríceps", 2),
        getCoreExercise()
      ], profile),
      createWorkoutDay(selectedTrainingDays[4], "Tracción B (Espalda Media & Brazos)", "alta", ["Espalda", "Bíceps", "Cardio"], [
        ...getExercisesForMuscle("Espalda", 2),
        ...getExercisesForMuscle("Bíceps", 2),
        getCardioExercise()
      ], profile),
      createWorkoutDay(selectedTrainingDays[5], "Piernas B (Cuádriceps & Detalle)", "alta", ["Glúteos", "Cuádriceps"], [
        ...getExercisesForMuscle("Cuádriceps", 2),
        ...getExercisesForMuscle("Glúteos", 2),
        getCoreExercise()
      ], profile)
    );
  }

  // Adjust schedule days based on selectedTrainingDays
  const userSchedule = selectedTrainingDays.map((dayName, idx) => {
    const defaultWorkout = schedule[idx % schedule.length];
    return {
      ...defaultWorkout,
      day: dayName.toLowerCase()
    };
  });

  let splitName = "Full Body A/B";
  if (totalDays === 3) splitName = isFemale ? "Tren Inferior / Superior / Core (Femenino)" : "Push / Pull / Legs (Masculino)";
  else if (totalDays === 4) splitName = "Torso / Piernas A/B";
  else if (totalDays === 5) splitName = "PPL + Torso/Piernas";
  else if (totalDays === 6) splitName = "Push / Pull / Legs x2";

  return {
    goal,
    level: experienceLevel,
    split: splitName,
    schedule: userSchedule
  };
}

function createWorkoutDay(day, title, intensity, mainMuscles, exercises, profile) {
  const warmup = [
    "Movilidad articular dinámica (tobillos, cadera, hombros) — 5 min",
    "Cardio suave opcional (caminadora o elíptica) — 3-5 min"
  ];
  const cooldown = [
    "Estiramiento estático ligero de los grupos musculares trabajados — 5 min",
    "Respiraciones profundas para bajar pulsaciones — 2 min"
  ];
  
  const safetyNotes = [
    "Prioriza la técnica perfecta antes de aumentar el peso.",
    "Si sientes dolor en alguna articulación (especialmente rodillas u hombros), detén el ejercicio inmediatamente."
  ];

  if (profile.injuries && profile.injuries.length > 0) {
    safetyNotes.push(`Adaptado por restricciones físicas: ${profile.injuries.join(", ")}.`);
  }

  return {
    id: `workout_${title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_${day}`,
    title,
    goal: profile.goal,
    level: profile.experienceLevel,
    durationMin: 45 + (exercises.length * 2),
    intensity,
    mainMuscles,
    warmup,
    exercises,
    cooldown,
    safetyNotes,
    nutritionFocus: day === "lunes" || day === "martes" || day === "miércoles" ? "carbohidratos_pre_entreno" : "alto_proteina"
  };
}

/**
 * 2. NUTRITION PLAN GENERATOR
 */
function generateNutritionPlan(profile, workoutPlan) {
  const {
    goal = "ganar_musculo",
    weightKg = 70,
    preferredTrainingTime = "07:00",
    foodRestrictions = [],
    dislikedFoods = [],
    budgetLevel = "medio"
  } = profile;

  // Calculate generic daily target calories and macros based on scientific targets
  let targetCalories = 2000;
  let targetProtein = 140; // in grams
  let targetCarbs = 220;
  let targetFats = 65;

  if (goal === "bajar_peso") {
    targetCalories = Math.round(weightKg * 22); // Moderate deficit
    targetProtein = Math.round(weightKg * 2.2); // High protein
    targetCarbs = Math.round(weightKg * 1.8);
    targetFats = Math.round(weightKg * 0.7);
  } else if (goal === "subir_peso") {
    targetCalories = Math.round(weightKg * 34); // Healthy surplus
    targetProtein = Math.round(weightKg * 1.8);
    targetCarbs = Math.round(weightKg * 5.0); // Dense nutrient delivery
    targetFats = Math.round(weightKg * 1.1);
  } else if (goal === "ganar_musculo") {
    targetCalories = Math.round(weightKg * 32); // Mild surplus
    targetProtein = Math.round(weightKg * 2.0); // Optimal protein
    targetCarbs = Math.round(weightKg * 4.5);
    targetFats = Math.round(weightKg * 1.0);
  } else if (goal === "definir") {
    targetCalories = Math.round(weightKg * 24); // Deficit
    targetProtein = Math.round(weightKg * 2.3); // High protein retention
    targetCarbs = Math.round(weightKg * 2.2); // Controlled carbs
    targetFats = Math.round(weightKg * 0.7);
  } else if (goal === "tonificar") {
    targetCalories = Math.round(weightKg * 28); // Maintenance/Enegy balance
    targetProtein = Math.round(weightKg * 1.8); // Moderate protein
    targetCarbs = Math.round(weightKg * 3.2);
    targetFats = Math.round(weightKg * 0.9);
  } else { // default fallback
    targetCalories = Math.round(weightKg * 28);
    targetProtein = Math.round(weightKg * 1.8);
    targetCarbs = Math.round(weightKg * 3.2);
    targetFats = Math.round(weightKg * 0.9);
  }

  // Pre-filter recipes based on goal, restrictions & dislikes
  let validRecipes = recipesDb.filter(recipe => {
    // Goal filter
    if (!recipe.goal.includes(goal)) return false;

    // Budget filter
    if (budgetLevel === "bajo" && recipe.budgetLevel !== "bajo") return false;
    
    // Exclude restricted ingredients
    if (foodRestrictions.length > 0) {
      const activeRestrictions = foodRestrictions.map(r => r.toLowerCase());
      const hasRestricted = recipe.ingredients.some(ing => 
        activeRestrictions.some(rest => ing.toLowerCase().includes(rest))
      );
      if (hasRestricted) return false;
    }

    // Exclude disliked foods
    if (dislikedFoods.length > 0) {
      const activeDislikes = dislikedFoods.map(d => d.toLowerCase());
      const hasDisliked = recipe.ingredients.some(ing => 
        activeDislikes.some(dis => ing.toLowerCase().includes(dis))
      );
      if (hasDisliked) return false;
    }

    return true;
  });

  // Fallback if goal + restrictions filters return empty list
  if (validRecipes.length === 0) {
    validRecipes = recipesDb.filter(recipe => {
      if (budgetLevel === "bajo" && recipe.budgetLevel !== "bajo") return false;
      return true;
    });
  }

  const getFilteredRecipe = (mealType, fallbackId) => {
    const list = validRecipes.filter(rec => rec.mealType === mealType);
    if (list.length > 0) {
      return list[Math.floor(Math.random() * list.length)];
    }
    // Return from global database if restricted list is empty
    const globalList = recipesDb.filter(rec => rec.mealType === mealType);
    return globalList.find(r => r.id === fallbackId) || globalList[0];
  };

  const daysOfWeek = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];
  const weeklyPlan = daysOfWeek.map(dayName => {
    // Check if training day
    const workoutDayData = workoutPlan.schedule.find(d => d.day === dayName);
    const isTrainingDay = !!workoutDayData;

    // Carb cycling logic
    let dayCalories;
    let dayCarbs;
    let dayFocus;

    if (isTrainingDay) {
      dayFocus = "alto_carbohidrato";
      dayCalories = Math.round(targetCalories * 1.05);
      dayCarbs = Math.round(targetCarbs * 1.15);
    } else {
      dayFocus = "bajo_carbohidrato";
      dayCalories = Math.round(targetCalories * 0.9);
      dayCarbs = Math.round(targetCarbs * 0.8);
    }

    // Setup meals by preferred time
    // Default meal selection
    const breakfastRecipe = getFilteredRecipe("desayuno", "receta_1");
    const snack1Recipe = getFilteredRecipe("media_manana", "receta_41");
    const lunchRecipe = getFilteredRecipe("almuerzo", "receta_81");
    const snack2Recipe = getFilteredRecipe("media_tarde", "receta_121");
    const dinnerRecipe = getFilteredRecipe("cena", "receta_161");

    const meals = {
      desayuno: {
        id: "m_breakfast",
        title: "Desayuno",
        time: "08:00",
        recipe: breakfastRecipe,
        focus: "Proteína y energía inicial"
      },
      media_manana: {
        id: "m_snack1",
        title: "Snack Mañana",
        time: "11:00",
        recipe: snack1Recipe,
        focus: "Merienda saciante"
      },
      almuerzo: {
        id: "m_lunch",
        title: "Almuerzo",
        time: "13:30",
        recipe: lunchRecipe,
        focus: "Carbohidratos complejos y proteína magra"
      },
      media_tarde: {
        id: "m_snack2",
        title: "Snack Tarde",
        time: "17:00",
        recipe: snack2Recipe,
        focus: "Aporte energético pre-entreno"
      },
      cena: {
        id: "m_dinner",
        title: "Cena",
        time: "20:30",
        recipe: dinnerRecipe,
        focus: "Proteína de fácil digestión y fibra"
      }
    };

    // Adjust Timing & pre/post labels based on training time
    const trainingHour = parseInt(preferredTrainingTime.split(":")[0]);
    if (isTrainingDay) {
      if (trainingHour < 10) {
        // Morning Training: Pre-workout is a light snack early or coffee/fruit. Post-workout is breakfast!
        meals.desayuno.title = "Desayuno Post-Entrenamiento (Fuerte)";
        meals.desayuno.focus = "Recuperación de glucógeno y reconstrucción muscular";
        meals.media_tarde.title = "Snack Pre-Entrenamiento (Día siguiente)";
      } else if (trainingHour >= 11 && trainingHour <= 14) {
        // Midday Training: Pre-workout is snack 1. Post-workout is lunch!
        meals.media_manana.title = "Snack Pre-Entrenamiento";
        meals.media_manana.focus = "Energía rápida antes de entrenar";
        meals.almuerzo.title = "Almuerzo Post-Entrenamiento (Fuerte)";
        meals.almuerzo.focus = "Carga de macronutrientes post-esfuerzo";
      } else {
        // Afternoon/Night Training: Pre-workout is snack 2. Post-workout is dinner!
        meals.media_tarde.title = "Snack Pre-Entrenamiento";
        meals.media_tarde.focus = "Carbohidratos rápidos para rendir";
        meals.cena.title = "Cena Post-Entrenamiento";
        meals.cena.focus = "Recuperación nocturna y regeneración celular";
      }
    }

    return {
      day: dayName,
      isTrainingDay,
      nutritionFocus: dayFocus,
      calories: dayCalories,
      protein: targetProtein,
      carbs: dayCarbs,
      fats: targetFats,
      meals
    };
  });

  return {
    goal,
    targetCalories,
    targetProtein,
    targetCarbs,
    targetFats,
    weeklyPlan
  };
}

/**
 * 3. SHOPPING LIST GENERATOR
 */
function generateShoppingList(nutritionPlan, profile) {
  const categoriesMap = {
    Proteínas: [],
    Carbohidratos: [],
    Grasas: [],
    Vegetales: [],
    Frutas: [],
    Extras: []
  };

  const processedIngredients = new Set();

  // Iterate over all recipes in the weekly plan
  nutritionPlan.weeklyPlan.forEach(day => {
    Object.values(day.meals).forEach(meal => {
      if (meal.recipe && meal.recipe.ingredients) {
        meal.recipe.ingredients.forEach(ing => {
          const lowerIng = ing.toLowerCase();
          
          // Basic sorting logic based on keywords
          let targetCategory = "Extras";
          if (lowerIng.includes("pollo") || lowerIng.includes("atún") || lowerIng.includes("huevo") || lowerIng.includes("res") || lowerIng.includes("queso") || lowerIng.includes("yogur") || lowerIng.includes("lenteja") || lowerIng.includes("pescado")) {
            targetCategory = "Proteínas";
          } else if (lowerIng.includes("arroz") || lowerIng.includes("pan") || lowerIng.includes("avena") || lowerIng.includes("papa") || lowerIng.includes("camote") || lowerIng.includes("verde") || lowerIng.includes("yuca") || lowerIng.includes("quinua") || lowerIng.includes("choclo")) {
            targetCategory = "Carbohidratos";
          } else if (lowerIng.includes("aguacate") || lowerIng.includes("maní") || lowerIng.includes("aceite") || lowerIng.includes("nuez") || lowerIng.includes("semilla")) {
            targetCategory = "Grasas";
          } else if (lowerIng.includes("lechuga") || lowerIng.includes("tomate") || lowerIng.includes("cebolla") || lowerIng.includes("brócoli") || lowerIng.includes("zanahoria") || lowerIng.includes("espinaca") || lowerIng.includes("pimiento") || lowerIng.includes("calabacín") || lowerIng.includes("pepino")) {
            targetCategory = "Vegetales";
          } else if (lowerIng.includes("banano") || lowerIng.includes("frutilla") || lowerIng.includes("mora") || lowerIng.includes("naranja") || lowerIng.includes("piña") || lowerIng.includes("manzana")) {
            targetCategory = "Frutas";
          }

          // Deduplicate roughly by name
          const cleanName = ing.replace(/^[\d\s/g.,-]+(g|cup|taza|unidad|unidades|rebanada|rebanadas|cucharada|cucharadita|cucharadas|cucharaditas)?\s*(de)?\s*/i, "").trim();

          if (!processedIngredients.has(cleanName.toLowerCase())) {
            processedIngredients.add(cleanName.toLowerCase());
            
            // Map quantity roughly
            let qty = "Al gusto / Semanal";
            if (cleanName.toLowerCase().includes("pollo")) qty = "1.5 kg";
            else if (cleanName.toLowerCase().includes("atún")) qty = "4 latas";
            else if (cleanName.toLowerCase().includes("huevo")) qty = "15 unidades";
            else if (cleanName.toLowerCase().includes("papa")) qty = "1.2 kg";
            else if (cleanName.toLowerCase().includes("camote")) qty = "1 kg";
            else if (cleanName.toLowerCase().includes("verde")) qty = "3 unidades";
            else if (cleanName.toLowerCase().includes("arroz")) qty = "1 bolsa (1kg)";
            else if (cleanName.toLowerCase().includes("avena")) qty = "500 g";
            else if (cleanName.toLowerCase().includes("aguacate")) qty = "3 unidades";
            else if (cleanName.toLowerCase().includes("fresco")) qty = "2 unidades (400g)";
            else if (cleanName.toLowerCase().includes("griego")) qty = "4 envases (150g)";
            
            categoriesMap[targetCategory].push({
              name: cleanName,
              quantity: qty,
              originalText: ing,
              checked: false
            });
          }
        });
      }
    });
  });

  // Convert categories object to array format matching requirements
  const categoriesArray = Object.entries(categoriesMap)
    .filter(([, items]) => items.length > 0)
    .map(([name, items]) => ({
      name,
      items
    }));

  return {
    week: "Semana 1",
    city: profile.city || "Cuenca",
    budgetLevel: profile.budgetLevel || "medio",
    categories: categoriesArray
  };
}
