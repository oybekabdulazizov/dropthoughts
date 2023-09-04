import mongoose from 'mongoose';

let isConnected = false;

export const connectToDB = async () => {
  mongoose.set('strictQuery', true);

  if (!process.env.MONGODB_URL) {
    throw new Error('Mongo Database URL not found!');
  }
  if (isConnected) {
    console.log('Already connected to the database...');
  }

  try {
    await mongoose.connect(process.env.MONGODB_URL);
    isConnected = true;
    console.log('Connected to the database...');
  } catch (err: any) {
    throw new Error(err);
  }
};