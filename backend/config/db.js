const mongoose = require('mongoose');
const seedData = require('../seedData');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
     if (process.env.NODE_ENV === 'development') {
      await seedData();
      console.log('Seed completed');
    }
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};


module.exports = connectDB;
