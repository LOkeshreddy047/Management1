const mongoose = require('mongoose');
const User = require('../models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://lokesh:lokesh@management.0skx9ap.mongodb.net/?retryWrites=true&w=majority&appName=Management';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log('Connected to MongoDB Atlas');

  const existingAdmin = await User.findOne({ username: 'Lokeshreddy05' });
  if (existingAdmin) {
    console.log('Admin user already exists');
  } else {
    const adminUser = new User({
      username: 'Lokeshreddy05',
      password: 'Lokesh@123',
      role: 'admin',
    });
    await adminUser.save();
    console.log('Admin user created successfully');
  }

  mongoose.disconnect();
}).catch((error) => {
  console.error('Error connecting to MongoDB Atlas:', error);
});
