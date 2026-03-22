require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const checkDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    const count = await User.countDocuments();
    console.log(`Total users: ${count}`);
    const latest = await User.findOne().sort({ createdAt: -1 });
    if (latest) {
      console.log(`Latest user: ${latest.email} created at ${latest.createdAt}`);
    }
    process.exit(0);
  } catch (err) {
    console.error('DB Check error:', err);
    process.exit(1);
  }
};

checkDB();
