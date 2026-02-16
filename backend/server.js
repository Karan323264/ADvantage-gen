/**
 * AdVantage Gen - Server Entry Point
 * - Connects to MongoDB
 * - Starts Express server
 * - Loads application from app.js
 */
import app from './app.js';
import connectDB from './config/database.js';

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});