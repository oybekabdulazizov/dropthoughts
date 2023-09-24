import { Schema, model, models } from 'mongoose';

const userSchema = new Schema({
  idUser_clerk: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  image: String,
  bio: String,
  threads: [{ type: Schema.Types.ObjectId, ref: 'Thread' }],
  onboarded: { type: Boolean, default: false },
  likedThreads: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Like',
    },
  ],
});

const User = models.User || model('User', userSchema);
export default User;
