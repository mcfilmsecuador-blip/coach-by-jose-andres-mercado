import { exercisesDb } from './exercisesData.js';
import { recipesDb } from './recipesData.js';

export const mockUser = {
  id: "user_001",
  name: "Andrés",
  age: 36,
  biologicalSex: "male",
  country: "Ecuador",
  city: "Cuenca",
  heightCm: 172,
  weightKg: 78,
  goal: "ganar_musculo",
  secondaryGoal: "definir",
  experienceLevel: "intermedio",
  trainingDaysPerWeek: 4,
  selectedTrainingDays: ["lunes", "miércoles", "viernes", "sábado"],
  preferredTrainingTime: "07:00",
  equipment: "gimnasio_completo",
  injuries: [],
  foodRestrictions: [],
  dislikedFoods: [],
  budgetLevel: "medio",
  planType: "free",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"
};

export const mockProgress = {
  currentWeight: 78.0,
  initialWeight: 80.5,
  totalChange: -2.5,
  completedWorkouts: 16,
  weeklyConsistency: 90,
  streak: 6
};

export { exercisesDb, recipesDb };
