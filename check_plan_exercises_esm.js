import { generatePersonalizedPlan } from './src/utils/planGenerator.js';
import { mockUser } from './src/data/mockData.js';

import { exercisesDb } from './src/data/exercisesData.js';
const specificExercises = new Set(exercisesDb.map(ex => ex.id));

try {
  const activePlan = generatePersonalizedPlan(mockUser);
  const workoutSchedule = activePlan.workoutPlan?.schedule || [];
  
  console.log("=== AUDITING ACTIVE WORKOUT PLAN EXERCISES ===");
  console.log(`Plan generated: ${activePlan.workoutPlan.name}`);
  console.log(`Weekly workouts: ${workoutSchedule.length}`);
  
  const allPlanExercises = [];
  const exerciseMap = new Map();
  
  workoutSchedule.forEach(workout => {
    workout.exercises.forEach(ex => {
      if (!exerciseMap.has(ex.id)) {
        exerciseMap.set(ex.id, ex);
        allPlanExercises.push(ex);
      }
    });
  });
  
  console.log(`Total unique exercises in active plan: ${allPlanExercises.length}`);
  
  const withSpecificImage = [];
  const withFallbackImage = [];
  
  allPlanExercises.forEach(ex => {
    if (specificExercises.has(ex.id)) {
      withSpecificImage.push(ex);
    } else {
      withFallbackImage.push(ex);
    }
  });
  
  console.log(`- Exercises with dedicated specific illustrations: ${withSpecificImage.length}`);
  console.log(`- Exercises currently falling back to generic muscle group illustrations: ${withFallbackImage.length}`);
  
  if (withFallbackImage.length > 0) {
    console.log("\nList of plan exercises using generic fallbacks:");
    withFallbackImage.forEach(ex => {
      console.log(`  - [ID: ${ex.id}] ${ex.name} (Muscle: ${ex.mainMuscle}, fallback to /exercises/... generic)`);
    });
  }
} catch (err) {
  console.error("Error in ESM check:", err);
}
