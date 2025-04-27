const mongoose = require('mongoose');
const User = require('../models/User');

const MONGODB_URI = 'mongodb+srv://lokesh:lokesh@management.0skx9ap.mongodb.net/?retryWrites=true&w=majority&appName=Management';

async function deleteNonAdminUsers() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB Atlas');

    const deleteResult = await User.deleteMany({ role: { $ne: 'admin' } });
    console.log(`Deleted ${deleteResult.deletedCount} non-admin user(s)`);

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error deleting non-admin users:', error);
  }
}

deleteNonAdminUsers();
