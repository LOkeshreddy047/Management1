const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const User = require('../models/User');

// Middleware to simulate authentication and role extraction
function authMiddleware(req, res, next) {
  const userRole = req.headers['x-user-role'];
  const username = req.headers['x-username']; // added to identify student user
  if (!userRole) {
    return res.status(401).json({ message: 'Unauthorized: No role provided' });
  }
  req.userRole = userRole;
  req.username = username;
  next();
}

// Middleware to check admin role
function adminOnly(req, res, next) {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Admins only' });
  }
  next();
}

router.use(authMiddleware);

// POST /students - Add a new student (admin only)
router.post('/', adminOnly, async (req, res) => {
  try {
    const studentData = req.body;

    if (!studentData.studentId || !studentData.email) {
      return res.status(400).json({ message: 'studentId and email are required' });
    }

    // Check if username (studentId) already exists in User collection
    const existingUser = await User.findOne({ username: studentData.studentId });
    if (existingUser) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    // Create User for student with username=studentId and password=email
    const newUser = new User({ username: studentData.studentId, password: studentData.email, role: 'student' });
    await newUser.save();

    // Set username field in studentData to studentId
    studentData.username = studentData.studentId;

    // Create Student document
    const newStudent = new Student(studentData);
    const savedStudent = await newStudent.save();

    res.status(201).json(savedStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET /students - Fetch students
router.get('/', async (req, res) => {
  try {
    if (req.userRole === 'admin') {
      const students = await Student.find();
      res.json(students);
    } else if (req.userRole === 'student') {
      if (!req.username) {
        return res.status(401).json({ message: 'Unauthorized: No username provided' });
      }
      const student = await Student.findOne({ studentId: req.username });
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
      res.json([student]);
    } else {
      res.status(403).json({ message: 'Forbidden' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /students/:id - Fetch a student by ID (admin only)
router.get('/:id', adminOnly, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /students/:id - Update student information (admin only)
router.put('/:id', adminOnly, async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedStudent) return res.status(404).json({ message: 'Student not found' });
    res.json(updatedStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /students/:id - Delete a student (admin only)
router.delete('/:id', adminOnly, async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);
    if (!deletedStudent) return res.status(404).json({ message: 'Student not found' });
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
