import { model, Schema } from 'mongoose'

const activitySchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    team: { type: Schema.Types.ObjectId, ref: 'Team' },
    type: {
      type: String,
      enum: ['running', 'walking', 'cycling', 'strength', 'yoga'],
      required: true,
    },
    durationMinutes: { type: Number, required: true, min: 1 },
    distanceKm: { type: Number, min: 0 },
    points: { type: Number, required: true, min: 0 },
    completedAt: { type: Date, required: true },
  },
  { timestamps: true },
)

activitySchema.index({ user: 1, type: 1, completedAt: 1 }, { unique: true })

export default model('Activity', activitySchema)
