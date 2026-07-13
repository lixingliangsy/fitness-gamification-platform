import { NextApiRequest, NextApiResponse } from 'next'
import { UserProfile, WorkoutLog } from '../../types'

// Note
let users: UserProfile[] = [
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
]

// Note
let workoutLogs: WorkoutLog[] = []

// Note
function calculateLevel(points: number): number {
  return Math.floor(points / 1000) + 1
}

// Note
function calculateStreak(lastActiveDate: string): number {
  const today = new Date().toISOString().split('T')[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
  
  if (lastActiveDate === today || lastActiveDate === yesterday) {
    return 1 // Needs further logic to compute streak days
  }
  return 0
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  if (req.method === 'GET') {
    // Note
    const userId = req.query.userId as string || 'user-001'
    const user = users.find(u => u.id === userId)
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    
    res.status(200).json(user)
  } else if (req.method === 'POST') {
    // Note
    const { userId, workoutType, duration, calories } = req.body
    
    if (!userId || !workoutType) {
      return res.status(400).json({ message: 'Missing required fields' })
    }
    
    const user = users.find(u => u.id === userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    
    // Note
    // Note
    // Note
    // Note
    const basePoints = 100
    const durationPoints = duration ? Math.floor(duration / 60) : 0 // 1 point per minute
    const caloriesPoints = calories ? Math.floor(calories * 0.5) : 0
    const totalPoints = basePoints + durationPoints + caloriesPoints
    
    // Note
    user.points += totalPoints
    user.level = calculateLevel(user.points)
    user.lastActiveDate = new Date().toISOString().split('T')[0]
    
    // Note
    const lastActive = new Date(user.lastActiveDate)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    if (user.lastActiveDate === yesterday.toISOString().split('T')[0] || 
        user.lastActiveDate === today.toISOString().split('T')[0]) {
      user.streak += 1
    } else {
      user.streak = 1
    }
    
    // Note
    const workoutLog: WorkoutLog = {
      id: `workout-${Date.now()}`,
      userId: userId,
      type: workoutType,
      duration: duration || 0,
      calories: calories || 0,
      points: totalPoints,
      completedAt: new Date().toISOString(),
    }
    
    workoutLogs.push(workoutLog)
    
    // Note
    res.status(200).json({
      user,
      workoutLog,
      pointsEarned: totalPoints,
    })
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
