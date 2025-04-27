const mongoose = require('mongoose');
const User = require('../models/User');

const MONGODB_URI = 'mongodb+srv://lokesh:lokesh@management.0skx9ap.mongodb.net/?retryWrites=true&w=majority&appName=Management';

async function resetAdminUser() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB Atlas');

    const deleteResult = await User.deleteMany({ role: 'admin' });
    console.log(`Deleted ${deleteResult.deletedCount} admin user(s)`);

    const adminUser = new User({
      username: 'Lokeshreddy',
      password: 'Lokesh@123',
      role: 'admin',
    });

    await adminUser.save();
    console.log('New admin user created successfully');

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error resetting admin user:', error);
  }
}

resetAdminUser();
