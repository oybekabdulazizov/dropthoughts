import { Schema, model, models } from 'mongoose';

const userSchema = new Schema({
  idUser_clerk: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  image: String,
  bio: String,
  thoughts: [{ type: Schema.Types.ObjectId, ref: 'Thought' }],
  followers: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  following: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  onboarded: { type: Boolean, default: false },
  likedThoughts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Like',
    },
  ],
});

const User = models.User || model('User', userSchema);
export default User;
