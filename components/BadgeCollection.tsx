import React from 'react'
import { Badge } from '../types'

interface BadgeCollectionProps {
  badges: Badge[]
}

export default function BadgeCollection({ badges }: BadgeCollectionProps) {
  const unlockedBadges = badges.filter(badge => badge.unlockedAt)
  const lockedBadges = badges.filter(badge => !badge.unlockedAt)

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'beginner': return '🌱'
      case 'intermediate': return '⭐'
      case 'advanced': return '🏆'
      case 'special': return '💎'
      default: return '🏅'
    }
  }

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'beginner': return 'Beginner'
      case 'intermediate': return 'Intermediate'
      case 'advanced': return 'Advanced'
      case 'special': return 'Special'
      default: return 'Other'
    }
  }

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-6">🏅 Badges</h2>

      {/* Stats */}
      <div className="mb-6 flex items-center space-x-4">
        <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg">
          <span className="font-semibold">Unlocked: {unlockedBadges.length}</span>
        </div>
        <div className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg">
          <span className="font-semibold">Total: {badges.length}</span>
        </div>
      </div>

      {/* Unlocked Badges */}
      {unlockedBadges.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-green-600">✅ Unlocked</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {unlockedBadges.map((badge) => (
              <div key={badge.id} className="border-2 border-yellow-300 bg-yellow-50 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="text-4xl">{badge.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">{badge.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{badge.description}</p>
                    <div className="mt-2 flex items-center space-x-2">
                      <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded">
                        {getCategoryName(badge.category)}
                      </span>
                      <span className="text-xs text-gray-500">
                        Unlocked {badge.unlockedAt}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Locked Badges */}
      {lockedBadges.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-600">🔒 Locked</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lockedBadges.map((badge) => (
              <div key={badge.id} className="border border-gray-200 bg-gray-50 rounded-lg p-4 opacity-60">
                <div className="flex items-start space-x-3">
                  <div className="text-4xl grayscale">{badge.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-600">{badge.name}</h4>
                    <p className="text-sm text-gray-500 mt-1">{badge.description}</p>
                    <div className="mt-2 flex items-center space-x-2">
                      <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                        {getCategoryName(badge.category)}
                      </span>
                      <span className="text-xs text-gray-400">
                        Requires {badge.pointsRequired} points
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
