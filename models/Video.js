import mongoose from 'mongoose';

const VideoSchema = new mongoose.Schema({
  sourceUrl: { type: String, required: true },
  transformedUrl: { type: String },
}, { timestamps: true });

export default mongoose.model('Video', VideoSchema);
