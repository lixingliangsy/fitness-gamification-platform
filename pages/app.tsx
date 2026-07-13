import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import UserProfile from '../components/UserProfile'
import ChallengeList from '../components/ChallengeList'
import BadgeCollection from '../components/BadgeCollection'
import Leaderboard from '../components/Leaderboard'
import { UserProfile as UserProfileType, Badge, Challenge, UserChallenge, LeaderboardEntry } from '../types'

export default function Home() {
  const [user, setUser] = useState<UserProfileType | null>(null)
  const [badges, setBadges] = useState<Badge[]>([])
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [userChallenges, setUserChallenges] = useState<UserChallenge[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const [userRes, badgesRes, challengesRes, leaderboardRes] = await Promise.all([
        fetch('/api/user?userId=user-001'),
        fetch('/api/badges?userId=user-001'),
        fetch('/api/challenges?userId=user-001'),
        fetch('/api/leaderboard'),
      ])

      if (!userRes.ok || !badgesRes.ok || !challengesRes.ok || !leaderboardRes.ok) {
        throw new Error('Failed to fetch data')
      }

      const [userData, badgesData, challengesData, leaderboardData] = await Promise.all([
        userRes.json(),
        badgesRes.json(),
        challengesRes.json(),
        leaderboardRes.json(),
      ])

      setUser(userData)
      setBadges(badgesData)
      setChallenges(challengesData.challenges || [])
      setUserChallenges(challengesData.userChallenges || [])
      setLeaderboard(leaderboardData)
    } catch (error) {
      console.error('Error fetching data:', error)
      setError('Failed to load data. Please refresh and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCompleteChallenge = async (challengeId: string) => {
    try {
      const response = await fetch('/api/challenges', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          challengeId,
          userId: 'user-001' 
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to complete challenge')
      }

      const data = await response.json()
      
      // Update challenge list
      setChallenges(data.challenges || [])
      setUserChallenges(data.userChallenges || [])
      
      // Refresh user data (points updated)
      const userRes = await fetch('/api/user?userId=user-001')
      if (userRes.ok) {
        const userData = await userRes.json()
        setUser(userData)
      }
      
      // Refresh leaderboard
      const leaderboardRes = await fetch('/api/leaderboard')
      if (leaderboardRes.ok) {
        const leaderboardData = await leaderboardRes.json()
        setLeaderboard(leaderboardData)
      }
      
      // Refresh badges (may unlock new ones)
      const badgesRes = await fetch('/api/badges?userId=user-001')
      if (badgesRes.ok) {
        const badgesData = await badgesRes.json()
        setBadges(badgesData)
      }
      
      alert(`Challenge complete! You earned  ${data.pointsEarned || 0} points`)
    } catch (error) {
      console.error('Error completing challenge:', error)
      alert('Failed to complete challenge. Please try again.')
    }
  }

  const handleLogWorkout = async (workoutType: string, duration: number, calories: number) => {
    try {
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userId: 'user-001',
          workoutType,
          duration,
          calories 
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to log workout')
      }

      const data = await response.json()
      
      // Note
      setUser(data.user)
      
      // Refresh leaderboard
      const leaderboardRes = await fetch('/api/leaderboard')
      if (leaderboardRes.ok) {
        const leaderboardData = await leaderboardRes.json()
        setLeaderboard(leaderboardData)
      }
      
      // Refresh badges (may unlock new ones)
      const badgesRes = await fetch('/api/badges?userId=user-001')
      if (badgesRes.ok) {
        const badgesData = await badgesRes.json()
        setBadges(badgesData)
      }
      
      alert(`Workout logged! You earned  ${data.pointsEarned || 0} points`)
    } catch (error) {
      console.error('Error logging workout:', error)
      alert('Failed to log workout. Please try again.')
    }
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="text-gray-600 mt-4">Loading...</p>
        </div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchData}
            className="btn-primary"
          >
            Retry
          </button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div>
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            🎮 Make fitness fun
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            通过游戏化机制，让健身变成一种习惯。Complete、解锁Badges、登上Leaderboard！
          </p>
        </div>

        {/* User Profile */}
        {user && (
          <div id="profile" className="mb-8">
            <UserProfile user={user} badges={badges} />
          </div>
        )}

        {/* Quick Action: Log Workout */}
        <div className="mb-8 card">
          <h3 className="text-xl font-bold mb-4">📝 Log workout</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={() => handleLogWorkout('strength', 1800, 200)}
              className="btn-primary"
            >
              💪 Strength training (30 min)
            </button>
            <button 
              onClick={() => handleLogWorkout('running', 1200, 300)}
              className="btn-primary"
            >
              🏃 Run (20 min)
            </button>
            <button 
              onClick={() => handleLogWorkout('yoga', 2400, 150)}
              className="btn-primary"
            >
              🧘 Yoga (40 min)
            </button>
          </div>
        </div>

        {/* Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="card text-center">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold mb-2">Challenges</h3>
            <p className="text-gray-600">
              Complete daily, weekly, and monthly challenges for points
            </p>
          </div>
          <div className="card text-center">
            <div className="text-4xl mb-4">🏅</div>
            <h3 className="text-xl font-semibold mb-2">Badges</h3>
            <p className="text-gray-600">
              Unlock achievement badges for your fitness journey
            </p>
          </div>
          <div className="card text-center">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-xl font-semibold mb-2">Leaderboard</h3>
            <p className="text-gray-600">
              Compete with friends and reach the top of the leaderboard
            </p>
          </div>
        </div>

        {/* Challenges */}
        <div id="challenges" className="mb-8">
          <ChallengeList
            challenges={challenges}
            userChallenges={userChallenges}
            onCompleteChallenge={handleCompleteChallenge}
          />
        </div>

        {/* Badges */}
        <div id="badges" className="mb-8">
          <BadgeCollection badges={badges} />
        </div>

        {/* Leaderboard */}
        <div id="leaderboard" className="mb-8">
          <Leaderboard
            entries={leaderboard}
            currentUserId={user?.id || ''}
          />
        </div>

        {/* How It Works */}
        <div className="mt-12 card">
          <h2 className="text-2xl font-bold mb-6">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-primary-500 text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold mb-2">Log workouts</h3>
              <p className="text-gray-600">
                Log daily workouts for points and XP
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-500 text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold mb-2">Challenges</h3>
              <p className="text-gray-600">
                Take on challenges for bonus rewards
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-500 text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold mb-2">解锁Badges</h3>
              <p className="text-gray-600">
                达成成就，解锁专属Badges
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-500 text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="text-lg font-semibold mb-2">Reach the top</h3>
              <p className="text-gray-600">
                Earn points and climb to the top of the leaderboard
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
