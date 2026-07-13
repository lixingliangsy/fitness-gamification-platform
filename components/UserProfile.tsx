import React from 'react'
import type { UserProfile, Badge } from '../types'

interface UserProfileProps {
  user: UserProfile
  badges: Badge[]
}

export default function UserProfile({ user, badges }: UserProfileProps) {
  const unlockedBadges = badges.filter(badge => 
    badge.unlockedAt !== undefined
  )

  return (
    <div className="card">
      <div className="flex items-start space-x-6">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center text-white text-4xl">
            {user.avatar}
          </div>
        </div>

        {/* User Info */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
          
          {/* Level and Points */}
          <div className="mt-2 flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-yellow-500 text-xl">⭐</span>
              <span className="font-semibold">Level {user.level}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-blue-500 text-xl">💎</span>
              <span className="font-semibold">{user.points} points</span>
            </div>
          </div>

          {/* Streak */}
          <div className="mt-2 flex items-center space-x-2">
            <span className="text-orange-500 text-xl">🔥</span>
            <span className="font-semibold">{user.streak}-day streak</span>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>To next level</span>
              <span>{user.points} / {user.level * 1000}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-primary-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${(user.points / (user.level * 1000)) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Badges Summary */}
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              Unlocked {unlockedBadges.length} / {badges.length} 个Badges
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
