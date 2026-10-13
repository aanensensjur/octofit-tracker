import mongoose from 'mongoose'

const connectionString =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db'

export function connectDatabase() {
  return mongoose.connect(connectionString)
}
