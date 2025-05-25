// backend/config/db.js
const mongoose = require('mongoose');
const dotenv = require('dotenv'); // If you use it

dotenv.config(); // Load .env variables

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      // useNewUrlParser: true, // Deprecated in new Mongoose versions
      // useUnifiedTopology: true, // Deprecated
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error("Error in db.js during MongoDB connection:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;