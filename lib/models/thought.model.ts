import { Schema, model, models } from 'mongoose';

const thoughtSchema = new Schema({
  text: { type: String, required: true },
  image: String,
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
  repost: {
    type: Boolean,
    default: false,
  },
  archived: {
    type: Boolean,
    default: false,
  },
});

const Thought = models.Thought || model('Thought', thoughtSchema);
export default Thought;
