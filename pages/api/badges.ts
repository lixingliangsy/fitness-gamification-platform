import { NextApiRequest, NextApiResponse } from 'next'
import { Badge, UserProfile, Challenge, UserChallenge, WorkoutLog } from '../../types'

// Note
let badges: Badge[] = [
  {
    id: 'badge-001',
    name: 'Beginner',
    description: 'Complete your first workout',
    icon: '🌟',
    category: 'beginner',
    pointsRequired: 0,
    unlockedAt: '2023-06-01',
  },
  {
    id: 'badge-002',
    name: 'Persister',
    description: '7-day streak',
    icon: '🔥',
    category: 'beginner',
    pointsRequired: 500,
    unlockedAt: '2023-06-10',
  },
  {
    id: 'badge-003',
    name: 'Fitness enthusiast',
    description: 'Complete 50 workouts',
    icon: '💪',
    category: 'intermediate',
    pointsRequired: 1000,
    unlockedAt: '2023-08-15',
  },
  {
    id: 'badge-004',
    name: 'Challenger',
    description: 'Complete 10 daily challenges',
    icon: '🎯',
    category: 'intermediate',
    pointsRequired: 1500,
    unlockedAt: '2023-09-20',
  },
  {
    id: 'badge-005',
    name: 'Marathon runner',
    description: 'Run 100 km total',
    icon: '🏃',
    category: 'advanced',
    pointsRequired: 3000,
    unlockedAt: undefined,
  },
  {
    id: 'badge-006',
    name: 'Iron athlete',
    description: '30-day streak',
    icon: '🏆',
    category: 'advanced',
    pointsRequired: 5000,
    unlockedAt: undefined,
  },
  {
    id: 'badge-007',
    name: 'Fitness master',
    description: 'Reach level 10',
    icon: '👑',
    category: 'special',
    pointsRequired: 10000,
    unlockedAt: undefined,
  },
  {
    id: 'badge-008',
    name: 'Community star',
    description: 'Reach top 3 on the leaderboard',
    icon: '⭐',
    category: 'special',
    pointsRequired: 8000,
    unlockedAt: undefined,
  },
]

// Note
function checkAndUnlockBadges(
  userId: string,
  user: UserProfile,
  userChallenges: UserChallenge[],
  workoutLogs: WorkoutLog[],
  leaderboardRank: number | null
): Badge[] {
  const updatedBadges = [...badges]
  const now = new Date().toISOString().split('T')[0]
  
  // Note
  if (workoutLogs.filter(w => w.userId === userId).length >= 1) {
    const badge = updatedBadges.find(b => b.id === 'badge-001')
    if (badge && !badge.unlockedAt) {
      badge.unlockedAt = now
    }
  }
  
  // Note
  if (user.streak >= 7) {
    const badge = updatedBadges.find(b => b.id === 'badge-002')
    if (badge && !badge.unlockedAt) {
      badge.unlockedAt = now
    }
  }
  
  // Note
  const totalWorkouts = workoutLogs.filter(w => w.userId === userId).length
  if (totalWorkouts >= 50) {
    const badge = updatedBadges.find(b => b.id === 'badge-003')
    if (badge && !badge.unlockedAt) {
      badge.unlockedAt = now
    }
  }
  
  // Note
  const completedDailyChallenges = userChallenges.filter(
    uc => uc.completed && uc.challengeId.startsWith('challenge-')
  ).length
  if (completedDailyChallenges >= 10) {
    const badge = updatedBadges.find(b => b.id === 'badge-004')
    if (badge && !badge.unlockedAt) {
      badge.unlockedAt = now
    }
  }
  
  // Note
  const totalRunningDistance = workoutLogs
    .filter(w => w.userId === userId && w.type === 'running')
    .reduce((sum, w) => sum + (w.duration || 0), 0) // Simplified: use duration as distance
  if (totalRunningDistance >= 100000) { // 100 km = 100000 m
    const badge = updatedBadges.find(b => b.id === 'badge-005')
    if (badge && !badge.unlockedAt) {
      badge.unlockedAt = now
    }
  }
  
  // Note
  if (user.streak >= 30) {
    const badge = updatedBadges.find(b => b.id === 'badge-006')
    if (badge && !badge.unlockedAt) {
      badge.unlockedAt = now
    }
  }
  
  // Note
  if (user.level >= 10) {
    const badge = updatedBadges.find(b => b.id === 'badge-007')
    if (badge && !badge.unlockedAt) {
      badge.unlockedAt = now
    }
  }
  
  // Note
  if (leaderboardRank !== null && leaderboardRank <= 3) {
    const badge = updatedBadges.find(b => b.id === 'badge-008')
    if (badge && !badge.unlockedAt) {
      badge.unlockedAt = now
    }
  }
  
  badges = updatedBadges
  return updatedBadges
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  if (req.method === 'GET') {
    // Note
    const userId = req.query.userId as string || 'user-001'
    
    // Note
    // Note
    const mockUser: UserProfile = {
      id: userId,
      name: 'Alex Runner',
      avatar: '🏋️',
      level: 5,
      points: 3750,
      streak: 12,
      lastActiveDate: '2024-01-15',
      joinedAt: '2023-06-01',
    }
    
    // Note
    const updatedBadges = checkAndUnlockBadges(
      userId,
      mockUser,
      [], // userChallenges - 应该从数据库获取
      [], // workoutLogs - 应该从数据库获取
      null // leaderboardRank - 应该从Leaderboard计算
    )
    
    res.status(200).json(updatedBadges)
  } else if (req.method === 'POST') {
    // Note
    const { badgeId, userId } = req.body
    
    if (!badgeId || !userId) {
      return res.status(400).json({ message: 'Missing required fields' })
    }
    
    const badge = badges.find(b => b.id === badgeId)
    if (!badge) {
      return res.status(404).json({ message: 'Badge not found' })
    }
    
    if (badge.unlockedAt) {
      return res.status(400).json({ message: 'Badge already unlocked' })
    }
    
    badge.unlockedAt = new Date().toISOString().split('T')[0]
    
    res.status(200).json(badge)
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
