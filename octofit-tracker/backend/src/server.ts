import express from 'express'
import { connectDatabase } from './config/database'
import activity from './models/Activity'
import leaderboard from './models/Leaderboard'
import team from './models/Team'
import user from './models/User'
import workout from './models/Workout'

const app = express()
const port = Number(process.env.PORT || 8000)
const codespaceName = process.env.CODESPACE_NAME
const allowedOrigins = new Set([
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  ...(codespaceName ? [`https://${codespaceName}-5173.app.github.dev`] : []),
])

export const baseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000'

app.use((request, response, next) => {
  const origin = request.get('origin')
  if (origin && allowedOrigins.has(origin)) {
    response.setHeader('Access-Control-Allow-Origin', origin)
    response.setHeader('Vary', 'Origin')
    response.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS')
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  }

  if (request.method === 'OPTIONS') {
    response.sendStatus(origin && allowedOrigins.has(origin) ? 204 : 403)
    return
  }

  next()
})

app.use(express.json())

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' })
})

app.get('/api/users/', async (_request, response) => {
  response.json(await user.find().lean().exec())
})

app.get('/api/teams/', async (_request, response) => {
  response.json(await team.find().populate('members').lean().exec())
})

app.get('/api/activities/', async (_request, response) => {
  response.json(
    await activity.find().populate('user team').sort({ completedAt: -1 }).lean().exec(),
  )
})

app.get('/api/leaderboard/', async (_request, response) => {
  response.json(
    await leaderboard.find().populate('user team').sort({ period: -1, rank: 1 }).lean().exec(),
  )
})

app.get('/api/workouts/', async (_request, response) => {
  response.json(await workout.find().sort({ difficulty: 1, title: 1 }).lean().exec())
})

async function startServer() {
  await connectDatabase()
  console.log('Connected to octofit_db')
  app.listen(port, () => {
    console.log(`Octofit API listening at ${baseUrl}`)
  })
}

startServer().catch((error: unknown) => {
  console.error('Unable to start Octofit API:', error)
  process.exitCode = 1
})
