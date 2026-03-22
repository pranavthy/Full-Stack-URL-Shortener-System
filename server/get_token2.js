const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/linkswift').then(async () => {
  const user = await User.findOne({ email: 'pranavthy.chembu@gmail.com' });
  if(user) {
    const token = user.getResetPasswordToken();
    await user.save();
    console.log(`NEW_RESET_LINK: http://localhost:3000/resetpassword/${token}`);
  } else {
    console.log('RESET_LINK_ERROR: user not found');
  }
  process.exit(0);
}).catch(err => {
  console.log('RESET_LINK_ERROR:', err.message);
  process.exit(1);
});
