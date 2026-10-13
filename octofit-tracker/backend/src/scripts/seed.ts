import mongoose from 'mongoose'
import { connectDatabase } from '../config/database'
import activity from '../models/Activity'
import leaderboard from '../models/Leaderboard'
import team from '../models/Team'
import user from '../models/User'
import workout from '../models/Workout'

async function ensureUser(data: {
  username: string
  email: string
  firstName: string
  lastName: string
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced'
  points: number
}) {
  const existingUser = await user.findOne({ username: data.username })
  return existingUser ?? user.create(data)
}

async function seedDatabase() {
  await connectDatabase()
  console.log('Connected to octofit_db')

  try {
    // Seed the octofit_db database with test data.
    const sora = await ensureUser({
      username: 'sora-kim',
      email: 'sora.kim@example.com',
      firstName: 'Sora',
      lastName: 'Kim',
      fitnessLevel: 'beginner',
      points: 95,
    })
    const alex = await ensureUser({
      username: 'alex-rivera',
      email: 'alex.rivera@example.com',
      firstName: 'Alex',
      lastName: 'Rivera',
      fitnessLevel: 'intermediate',
      points: 140,
    })
    const nia = await ensureUser({
      username: 'nia-patel',
      email: 'nia.patel@example.com',
      firstName: 'Nia',
      lastName: 'Patel',
      fitnessLevel: 'intermediate',
      points: 120,
    })

    const octocats =
      (await team.findOne({ name: 'Octocats' })) ??
      (await team.create({
        name: 'Octocats',
        description: 'A friendly team building a consistent fitness habit.',
        members: [sora._id, alex._id],
        points: 235,
      }))
    const seaTurtles =
      (await team.findOne({ name: 'Sea Turtles' })) ??
      (await team.create({
        name: 'Sea Turtles',
        description: 'Steady training, strong teamwork, and healthy competition.',
        members: [nia._id],
        points: 120,
      }))

    const activities = [
      {
        user: sora._id,
        team: octocats._id,
        type: 'walking' as const,
        durationMinutes: 32,
        distanceKm: 2.6,
        points: 25,
        completedAt: new Date('2026-10-10T16:30:00.000Z'),
      },
      {
        user: sora._id,
        team: octocats._id,
        type: 'yoga' as const,
        durationMinutes: 25,
        points: 20,
        completedAt: new Date('2026-10-12T15:00:00.000Z'),
      },
      {
        user: alex._id,
        team: octocats._id,
        type: 'running' as const,
        durationMinutes: 28,
        distanceKm: 4.2,
        points: 45,
        completedAt: new Date('2026-10-11T17:15:00.000Z'),
      },
      {
        user: nia._id,
        team: seaTurtles._id,
        type: 'cycling' as const,
        durationMinutes: 40,
        distanceKm: 12,
        points: 50,
        completedAt: new Date('2026-10-11T14:00:00.000Z'),
      },
    ]
    for (const data of activities) {
      const existingActivity = await activity.findOne({
        user: data.user,
        type: data.type,
        completedAt: data.completedAt,
      })
      if (!existingActivity) await activity.create(data)
    }

    const standings = [
      { period: '2026-W41', user: alex._id, team: octocats._id, points: 140, rank: 1 },
      { period: '2026-W41', user: nia._id, team: seaTurtles._id, points: 120, rank: 2 },
      { period: '2026-W41', user: sora._id, team: octocats._id, points: 95, rank: 3 },
    ]
    for (const data of standings) {
      const existingEntry = await leaderboard.findOne({
        period: data.period,
        user: data.user,
      })
      if (!existingEntry) await leaderboard.create(data)
    }

    const workouts = [
      {
        title: 'Easy Start Walk',
        description: 'A low-impact session to build a regular movement routine.',
        difficulty: 'beginner' as const,
        durationMinutes: 25,
        exercises: ['Brisk walk', 'Gentle cooldown'],
      },
      {
        title: 'Park Interval Run',
        description: 'Alternate comfortable running with short recovery walks.',
        difficulty: 'intermediate' as const,
        durationMinutes: 30,
        exercises: ['Warm-up walk', 'Run 3 minutes', 'Walk 2 minutes', 'Cooldown'],
      },
      {
        title: 'Bodyweight Strength',
        description: 'A balanced strength circuit using only bodyweight movements.',
        difficulty: 'intermediate' as const,
        durationMinutes: 35,
        exercises: ['Squats', 'Incline push-ups', 'Reverse lunges', 'Plank'],
      },
    ]
    for (const data of workouts) {
      const existingWorkout = await workout.findOne({ title: data.title })
      if (!existingWorkout) await workout.create(data)
    }

    console.log('Database seeding complete')
  } finally {
    await mongoose.disconnect()
  }
}

seedDatabase().catch((error: unknown) => {
  console.error('Error seeding octofit_db:', error)
  process.exitCode = 1
})
