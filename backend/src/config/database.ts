import mongoose from 'mongoose';

// Falls back to the default local MongoDB instance when MONGODB_URI is not set
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/todo_app';

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(MONGODB_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    // Exiting here is intentional: the API is useless without a database
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};
