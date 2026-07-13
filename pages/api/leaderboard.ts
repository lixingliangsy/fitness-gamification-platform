import { NextApiRequest, NextApiResponse } from 'next'
import { LeaderboardEntry, UserProfile } from '../../types'

// Note
// Note
// Note

let users: UserProfile[] = [
  {
    id: 'user-002',
    name: 'Fitness champion',
    avatar: '🏋️♂️',
    level: 10,
    points: 12500,
    streak: 45,
    lastActiveDate: '2024-01-15',
    joinedAt: '2023-01-15',
  },
  {
    id: 'user-003',
    name: 'Yoga pro',
    avatar: '🧘♀️',
    level: 8,
    points: 9800,
    streak: 30,
    lastActiveDate: '2024-01-15',
    joinedAt: '2023-03-20',
  },
  {
    id: 'user-001',
    name: 'Alex Runner',
    avatar: '🏋️',
    level: 5,
    points: 3750,
    streak: 12,
    lastActiveDate: '2024-01-15',
    joinedAt: '2023-06-01',
  },
  {
    id: 'user-004',
    name: 'Running fanatic',
    avatar: '🏃♂️',
    level: 7,
    points: 8200,
    streak: 25,
    lastActiveDate: '2024-01-14',
    joinedAt: '2023-04-10',
  },
  {
    id: 'user-005',
    name: 'Fat loss expert',
    avatar: '💪',
    level: 6,
    points: 6500,
    streak: 18,
    lastActiveDate: '2024-01-15',
    joinedAt: '2023-05-15',
  },
]

// Note
function getBadgeCount(userId: string): number {
  // Note
  const badgeCounts: Record<string, number> = {
    'user-001': 4,
    'user-002': 8,
    'user-003': 6,
    'user-004': 5,
    'user-005': 5,
  }
  return badgeCounts[userId] || 0
}

// Note
function getWorkoutsCompleted(userId: string): number {
  // Note
  const workoutCounts: Record<string, number> = {
    'user-001': 120,
    'user-002': 320,
    'user-003': 280,
    'user-004': 250,
    'user-005': 180,
  }
  return workoutCounts[userId] || 0
}

// Note
export function updateUserPoints(userId: string, newPoints: number) {
  const userIndex = users.findIndex(u => u.id === userId)
  if (userIndex >= 0) {
    users[userIndex].points = newPoints
    users[userIndex].level = Math.floor(newPoints / 1000) + 1
  }
}

// Note
function getLeaderboard(): LeaderboardEntry[] {
  // Note
  const sortedUsers = [...users].sort((a, b) => b.points - a.points)
  
  // Note
  const leaderboard: LeaderboardEntry[] = sortedUsers.map((user, index) => ({
    rank: index + 1,
    user: user,
    points: user.points,
    badges: getBadgeCount(user.id),
    workoutsCompleted: getWorkoutsCompleted(user.id),
  }))
  
  return leaderboard
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  if (req.method === 'GET') {
    // Note
    const leaderboard = getLeaderboard()
    res.status(200).json(leaderboard)
  } else if (req.method === 'POST') {
    // Note
    const { userId, pointsEarned } = req.body
    
    if (!userId) {
      return res.status(400).json({ message: 'Missing userId' })
    }
    
    // Note
    const user = users.find(u => u.id === userId)
    if (user) {
      user.points += pointsEarned || 0
      user.level = Math.floor(user.points / 1000) + 1
      user.lastActiveDate = new Date().toISOString().split('T')[0]
    }
    
    // Note
    const leaderboard = getLeaderboard()
    res.status(200).json(leaderboard)
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
