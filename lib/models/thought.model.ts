import { Schema, model, models } from 'mongoose';

const thoughtSchema = new Schema({
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
  parentThoughtId: {
    type: String,
  },
  childrenThoughts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Thought',
    },
  ],
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Like',
    },
  ],
});

const Thought = models.Thought || model('Thought', thoughtSchema);
export default Thought;
