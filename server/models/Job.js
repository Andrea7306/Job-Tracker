import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    company:     { type: String, required: true, trim: true },
    role:        { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['Saved', 'Applied', 'Interview', 'Offer', 'Rejected'],
      default: 'Saved',
    },
    jobUrl:      { type: String, trim: true },
    description: { type: String }, // job description — fed to Gemini
    appliedAt:   { type: Date },
    deadline:    { type: Date },
    notes:       { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('Job', JobSchema);
