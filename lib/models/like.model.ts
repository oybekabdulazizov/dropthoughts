import { Schema, model, models } from 'mongoose';

const likeSchema = new Schema({
  likedAt: { type: Date, default: Date.now },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  threadId: { type: Schema.Types.ObjectId, ref: 'Thread' },
});

const Like = models.Like || model('Like', likeSchema);
export default Like;
