import { model, Schema } from 'mongoose'

const leaderboardSchema = new Schema(
  {
    period: { type: String, required: true, trim: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    team: { type: Schema.Types.ObjectId, ref: 'Team' },
    points: { type: Number, required: true, min: 0 },
    rank: { type: Number, required: true, min: 1 },
  },
  { timestamps: true },
)

leaderboardSchema.index({ period: 1, user: 1 }, { unique: true })

export default model('Leaderboard', leaderboardSchema)
