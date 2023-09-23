import { Schema, model, models } from 'mongoose';

const threadSchema = new Schema({
  text: { type: String, required: true },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  parentThreadId: {
    type: String,
  },
  childrenThreads: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Thread',
    },
  ],
  likes: [
    {
      likedAt: {
        type: Date,
      },
      likedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      _id: false,
    },
  ],
});

const Thread = models.Thread || model('Thread', threadSchema);
export default Thread;
