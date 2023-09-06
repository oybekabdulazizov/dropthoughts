import { Schema, model, models } from 'mongoose';

const threadSchema = new Schema({
  text: { type: String, required: true },
  authorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  communityId: {
    type: Schema.Types.ObjectId,
    ref: 'Community',
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
});

const Thread = models.Thread || model('Thread', threadSchema);
export default Thread;
