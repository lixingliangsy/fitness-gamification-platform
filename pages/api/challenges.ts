import { NextApiRequest, NextApiResponse } from 'next'
import { Challenge, UserChallenge } from '../../types'

// Challenge task data
let challenges: Challenge[] = [
  {
    id: 'challenge-001',
    title: '完成一次Strength训练',
    description: '完成至少30分钟的Strength训练，锻炼主要肌群',
    points: 100,
    type: 'daily',
    difficulty: 'easy',
    requirement: {
      type: 'workouts',
      target: 1,
    },
    expiresAt: '2024-01-16',
  },
  {
    id: 'challenge-002',
    title: 'Run 5 km',
    description: 'Complete a 5 km run at any pace',
    points: 150,
    type: 'daily',
    difficulty: 'medium',
    requirement: {
      type: 'steps',
      target: 5000,
    },
    expiresAt: '2024-01-16',
  },
  {
    id: 'challenge-003',
    title: 'Train 3 times this week',
    description: 'Complete at least 3 workouts this week',
    points: 500,
    type: 'weekly',
    difficulty: 'medium',
    requirement: {
      type: 'workouts',
      target: 3,
    },
    expiresAt: '2024-01-21',
  },
  {
    id: 'challenge-004',
    title: '7-day streak',
    description: 'Log a workout 7 days in a row',
    points: 1000,
    type: 'weekly',
    difficulty: 'hard',
    requirement: {
      type: 'streak',
      target: 7,
    },
    expiresAt: '2024-01-21',
  },
  {
    id: 'challenge-005',
    title: 'Burn 10,000 calories this month',
    description: 'Burn at least 10,000 calories through workouts this month',
    points: 2000,
    type: 'monthly',
    difficulty: 'hard',
    requirement: {
      type: 'calories',
      target: 10000,
    },
    expiresAt: '2024-01-31',
  },
]

// User challenge progress
let userChallenges: UserChallenge[] = [
  {
    userId: 'user-001',
    challengeId: 'challenge-001',
    progress: 0,
    completed: false,
  },
  {
    userId: 'user-001',
    challengeId: 'challenge-002',
    progress: 3200,
    completed: false,
  },
  {
    userId: 'user-001',
    challengeId: 'challenge-003',
    progress: 2,
    completed: false,
  },
]

// In-memory user store (use DB in production)
let users: any[] = [
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
]

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  if (req.method === 'GET') {
    // Note
    res.status(200).json({
      challenges: challenges,
      userChallenges: userChallenges.filter(uc => uc.userId === (req.query.userId || 'user-001')),
    })
  } else if (req.method === 'POST') {
    // Complete
    const { challengeId, userId } = req.body
    
    if (!challengeId || !userId) {
      return res.status(400).json({ message: 'Missing required fields' })
    }
    
    const challenge = challenges.find(c => c.id === challengeId)
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' })
    }
    
    // Note
    let userChallenge = userChallenges.find(
      uc => uc.userId === userId && uc.challengeId === challengeId
    )
    
    if (!userChallenge) {
      userChallenge = {
        userId: userId,
        challengeId: challengeId,
        progress: 0,
        completed: false,
      }
      userChallenges.push(userChallenge)
    }
    
    // Note
    userChallenge.progress = challenge.requirement.target
    userChallenge.completed = true
    userChallenge.completedAt = new Date().toISOString()
    
    // Note
    const userIndex = users.findIndex(u => u.id === userId)
    if (userIndex >= 0) {
      users[userIndex].points += challenge.points
      users[userIndex].level = Math.floor(users[userIndex].points / 1000) + 1
      users[userIndex].lastActiveDate = new Date().toISOString().split('T')[0]
    }
    
    // Note
    res.status(200).json({
      challenges: challenges,
      userChallenges: userChallenges.filter(uc => uc.userId === userId),
      pointsEarned: challenge.points,
      totalPoints: userIndex >= 0 ? users[userIndex].points : 0,
    })
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
