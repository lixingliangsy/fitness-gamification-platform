// Note
export interface UserProfile {
  id: string
  name: string
  avatar: string
  level: number
  points: number
  streak: number
  lastActiveDate: string
  joinedAt: string
}

// Badges
export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  category: 'beginner' | 'intermediate' | 'advanced' | 'special'
  pointsRequired: number
  unlockedAt?: string
}

// Note
export interface UserBadge {
  userId: string
  badgeId: string
  unlockedAt: string
}

// Challenges
export interface Challenge {
  id: string
  title: string
  description: string
  points: number
  type: 'daily' | 'weekly' | 'monthly'
  difficulty: 'easy' | 'medium' | 'hard'
  requirement: {
    type: 'workouts' | 'steps' | 'calories' | 'streak'
    target: number
  }
  expiresAt: string
}

// User challenge progress
export interface UserChallenge {
  userId: string
  challengeId: string
  progress: number
  completed: boolean
  completedAt?: string
}

// Note
export interface LeaderboardEntry {
  rank: number
  user: UserProfile
  points: number
  badges: number
  workoutsCompleted: number
}

// Workout logs
export interface WorkoutLog {
  id: string
  userId: string
  type: string
  duration: number
  calories: number
  points: number
  completedAt: string
}
