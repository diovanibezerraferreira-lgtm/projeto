export type IntensityLevel = 'leve' | 'moderado' | 'intenso';

export type MuscleGroup = 
  | 'Corpo Inteiro'
  | 'Pernas & Glúteos'
  | 'Braços & Peito'
  | 'Abdômen & Core'
  | 'Alongamento & Mobilidade';

export type ExerciseIconType =
  | 'jumping_jacks'
  | 'squats'
  | 'wall_pushup'
  | 'glute_bridge'
  | 'knee_plank'
  | 'high_knees'
  | 'lunges'
  | 'bird_dog'
  | 'calf_raises'
  | 'arm_circles'
  | 'cat_cow'
  | 'stretching';

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  durationSeconds?: number;
  reps?: number;
  sets: number;
  restSeconds: number;
  instructions: string[];
  beginnerTip: string;
  intensity: IntensityLevel;
  iconType: ExerciseIconType;
}

export interface DayWorkout {
  day: number;
  week: number;
  title: string;
  focus: string;
  description: string;
  estimatedMinutes: number;
  estimatedCalories: number;
  isRestDay: boolean;
  restAdvice?: string;
  exercises: Exercise[];
}

export type FitnessGoal = 
  | 'perder_peso'
  | 'ganhar_massa'
  | 'disposicao'
  | 'saude_postura';

export interface UserProfile {
  name: string;
  goal: FitnessGoal;
  initialWeight: number;
  currentWeight: number;
  targetWeight: number;
  heightCm: number;
  experienceLevel: 'iniciante' | 'intermediario';
  isPremium: boolean;
  streakDays: number;
}

export interface WeightRecord {
  id: string;
  date: string; // YYYY-MM-DD
  weight: number;
  note?: string;
}

export interface CompletedWorkout {
  id: string;
  day: number;
  title: string;
  completedAt: string; // ISO date
  durationSeconds: number;
  caloriesBurned: number;
  totalExercises: number;
}
