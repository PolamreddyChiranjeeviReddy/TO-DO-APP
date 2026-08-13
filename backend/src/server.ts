import app from './app';
import { connectDB } from './config/database';

const PORT = process.env.PORT || 5000;

// Boot sequence: establish the DB connection first, then start accepting requests
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
