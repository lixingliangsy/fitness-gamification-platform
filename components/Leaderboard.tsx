import React from 'react'
import { LeaderboardEntry } from '../types'

interface LeaderboardProps {
  entries: LeaderboardEntry[]
  currentUserId: string
}

export default function Leaderboard({ entries, currentUserId }: LeaderboardProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇'
      case 2: return '🥈'
      case 3: return '🥉'
      default: return null
    }
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-yellow-100 border-yellow-400'
      case 2: return 'bg-gray-100 border-gray-400'
      case 3: return 'bg-orange-100 border-orange-400'
      default: return 'bg-white border-gray-200'
    }
  }

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-6">🏆 Leaderboard</h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-3 px-4">Rank</th>
              <th className="text-left py-3 px-4">User</th>
              <th className="text-center py-3 px-4">Points</th>
              <th className="text-center py-3 px-4">Badges</th>
              <th className="text-center py-3 px-4">Workouts</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr 
                key={entry.user.id}
                className={`border-b border-gray-100 ${
                  entry.user.id === currentUserId ? 'font-bold bg-blue-50' : ''
                } hover:bg-gray-50 transition`}
              >
                {/* Rank */}
                <td className="py-4 px-4">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${getRankColor(entry.rank)}`}>
                    {getRankIcon(entry.rank) || entry.rank}
                  </div>
                </td>

                {/* User */}
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                      {entry.user.avatar}
                    </div>
                    <div>
                      <div className="font-semibold">
                        {entry.user.name}
                        {entry.user.id === currentUserId && (
                          <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-1 rounded">You</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        Level {entry.user.level}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Points */}
                <td className="py-4 px-4 text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <span className="text-yellow-500">💎</span>
                    <span className="font-semibold">{entry.points}</span>
                  </div>
                </td>

                {/* Badges */}
                <td className="py-4 px-4 text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <span className="text-yellow-500">🏅</span>
                    <span className="font-semibold">{entry.badges}</span>
                  </div>
                </td>

                {/* Workouts */}
                <td className="py-4 px-4 text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <span className="text-green-500">💪</span>
                    <span className="font-semibold">{entry.workoutsCompleted}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center justify-center space-x-6 text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <span>🥇</span>
          <span>1st place</span>
        </div>
        <div className="flex items-center space-x-2">
          <span>🥈</span>
          <span>2nd place</span>
        </div>
        <div className="flex items-center space-x-2">
          <span>🥉</span>
          <span>3rd place</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs">You</span>
          <span>Current user</span>
        </div>
      </div>
    </div>
  )
}
