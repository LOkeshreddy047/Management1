const mongoose = require('mongoose');
const User = require('../models/User');
const Student = require('../models/Student');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://lokesh:lokesh@management.0skx9ap.mongodb.net/?retryWrites=true&w=majority&appName=Management';

async function resetUsersAndSync() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB Atlas');

    // Delete all users
    await User.deleteMany({});
    console.log('Deleted all users');

    // Fetch all students
    const students = await Student.find({});
    console.log(`Found ${students.length} students`);

    // Create user for each student with username=studentId and password=email
    for (const student of students) {
      const newUser = new User({
        username: student.studentId,
        password: student.email,
        role: 'student',
      });
      await newUser.save();
      console.log(`Created user for student ${student.studentId}`);
    }

    console.log('All student users created successfully');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

resetUsersAndSync();
