import React from 'react'
import { Challenge, UserChallenge } from '../types'

interface ChallengeListProps {
  challenges: Challenge[]
  userChallenges: UserChallenge[]
  onCompleteChallenge: (challengeId: string) => void
}

export default function ChallengeList({ challenges, userChallenges, onCompleteChallenge }: ChallengeListProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'daily': return '📅'
      case 'weekly': return '📆'
      case 'monthly': return '🗓️'
      default: return '📋'
    }
  }

  const getUserChallenge = (challengeId: string) => {
    return userChallenges.find(uc => uc.challengeId === challengeId)
  }

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-6">🎯 Challenges</h2>

      <div className="space-y-4">
        {challenges.map((challenge) => {
          const userChallenge = getUserChallenge(challenge.id)
          const progress = userChallenge?.progress || 0
          const completed = userChallenge?.completed || false
          const percentage = Math.min((progress / challenge.requirement.target) * 100, 100)

          return (
            <div key={challenge.id} className="border rounded-lg p-4 hover:shadow-md transition">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-2xl">{getTypeIcon(challenge.type)}</span>
                    <h3 className="text-lg font-semibold">{challenge.title}</h3>
                    <span className={`badge ${getDifficultyColor(challenge.difficulty)}`}>
                      {challenge.difficulty === 'easy' ? 'Easy' : 
                       challenge.difficulty === 'medium' ? 'Medium' : 'Hard'}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-3">{challenge.description}</p>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{progress} / {challenge.requirement.target}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          completed ? 'bg-green-500' : 'bg-primary-600'
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Reward */}
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span>🏆</span>
                    <span>Reward: {challenge.points} points</span>
                  </div>
                </div>

                {/* Complete Button */}
                <div className="ml-4">
                  {completed ? (
                    <span className="text-green-500 font-semibold">✅ Done</span>
                  ) : (
                    <button
                      onClick={() => onCompleteChallenge(challenge.id)}
                      className="btn-primary text-sm"
                    >
                      Log workouts
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
