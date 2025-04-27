import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../AuthContext";

function AddStudent() {
  const { userRole } = useContext(AuthContext);
  const [student, setStudent] = useState({
    studentId: "",
    firstName: "",
    lastName: "",
    email: "",
    dob: "",
    department: "",
    enrollmentYear: "",
    isActive: true,
  });
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Calculate max date for dob as today minus 17 years
  const maxDobDate = new Date();
  maxDobDate.setFullYear(maxDobDate.getFullYear() - 17);
  const maxDobDateString = maxDobDate.toISOString().split("T")[0];

  const departmentPrefixes = {
    "160122733": "Computer Science",
    "160122737": "Information Technology",
    "160122734": "EEE",
    "160122735": "ECE",
    "160122736": "Mechanical Engineering",
    "160122732": "Civil Engineering",
    "160122802": "Chemical Engineering",
    "160122808": "Bio Technology",
  };

  const validate = () => {
    const newErrors = {};

    if (!student.studentId) newErrors.studentId = "Student ID is required";
    else {
      const prefix = departmentPrefixes[student.studentId.substring(0, 9)];
      if (!prefix) {
        newErrors.studentId = "Invalid roll number prefix";
      } else if (!new RegExp(`^${student.studentId.substring(0, 9)}\\d{3}$`).test(student.studentId)) {
        newErrors.studentId = `Student ID must be exactly 12 digits starting with ${student.studentId.substring(0, 9)}`;
      }
    }

    if (!student.firstName) newErrors.firstName = "First name is required";
    else if (student.firstName.length < 2)
      newErrors.firstName = "First name must be at least 2 characters";

    if (!student.lastName) newErrors.lastName = "Last name is required";
    else if (student.lastName.length < 2)
      newErrors.lastName = "Last name must be at least 2 characters";

    if (!student.email) newErrors.email = "Email is required";
    else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(student.email))
      newErrors.email = "Email must be a valid format";

    if (!student.dob) newErrors.dob = "Date of birth is required";
    else if (student.dob > maxDobDateString)
      newErrors.dob = "Date of birth must be at least 17 years ago";

    if (!student.department) newErrors.department = "Department is required";

    if (!student.enrollmentYear)
      newErrors.enrollmentYear = "Enrollment year is required";
    else if (
      isNaN(student.enrollmentYear) ||
      student.enrollmentYear < 2000 ||
      student.enrollmentYear > new Date().getFullYear()
    )
      newErrors.enrollmentYear = `Enrollment year must be between 2000 and ${new Date().getFullYear()}`;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedStudent = { ...student, [name]: value };

    if (name === "studentId" && value.length >= 9) {
      const prefix = value.substring(0, 9);
      if (departmentPrefixes[prefix]) {
        updatedStudent.department = departmentPrefixes[prefix];
      }
    }

    setStudent(updatedStudent);
    setErrors({ ...errors, [name]: "" });
    setSubmitStatus("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (userRole !== "admin") {
      setSubmitStatus("Only admins can add students.");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("");
    try {
      await axios.post(
        "http://localhost:5000/students",
        {
          studentId: student.studentId,
          firstName: student.firstName,
          lastName: student.lastName,
          email: student.email,
          dob: student.dob,
          department: student.department,
          enrollmentYear: Number(student.enrollmentYear),
          isActive: student.isActive,
        },
        {
          headers: { "x-user-role": userRole },
        }
      );
      setSubmitStatus("Student added successfully!");
      setStudent({
        studentId: "",
        firstName: "",
        lastName: "",
        email: "",
        dob: "",
        department: "",
        enrollmentYear: "",
        isActive: true,
      });
      setTimeout(() => {
        navigate("/students");
      }, 1500);
    } catch (error) {
      setSubmitStatus("Error adding student");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (userRole !== "admin") {
    return <p>You do not have permission to add students.</p>;
  }

  return (
    <div>
      <h2>Add Student</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div>
          <label>Student ID: </label>
          <input
            name="studentId"
            value={student.studentId}
            onChange={handleChange}
          />
          {errors.studentId && (
            <div style={{ color: "red" }}>{errors.studentId}</div>
          )}
        </div>
        <div>
          <label>First Name: </label>
          <input
            name="firstName"
            value={student.firstName}
            onChange={handleChange}
          />
          {errors.firstName && (
            <div style={{ color: "red" }}>{errors.firstName}</div>
          )}
        </div>
        <div>
          <label>Last Name: </label>
          <input
            name="lastName"
            value={student.lastName}
            onChange={handleChange}
          />
          {errors.lastName && (
            <div style={{ color: "red" }}>{errors.lastName}</div>
          )}
        </div>
        <div>
          <label>Email: </label>
          <input
            name="email"
            type="email"
            value={student.email}
            onChange={handleChange}
          />
          {errors.email && <div style={{ color: "red" }}>{errors.email}</div>}
        </div>
        <div>
          <label>Date of Birth: </label>
          <input
            name="dob"
            type="date"
            value={student.dob}
            onChange={handleChange}
            max={maxDobDateString}
          />
          {errors.dob && <div style={{ color: "red" }}>{errors.dob}</div>}
        </div>
        <div>
          <label>Department: </label>
          <select
            name="department"
            value={student.department}
            onChange={handleChange}
          >
            <option value="">Select department</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Mechanical Engineering">Mechanical Engineering</option>
            <option value="Civil Engineering">Civil Engineering</option>
            <option value="ECE">ECE</option>
            <option value="EEE">EEE</option>
            <option value="Bio Technology">Bio Technology</option>
            <option value="Chemical Engineering">Chemical Engineering</option>
          </select>
          {errors.department && (
            <div style={{ color: "red" }}>{errors.department}</div>
          )}
        </div>
        <div>
          <label>Enrollment Year: </label>
          <select
            name="enrollmentYear"
            value={student.enrollmentYear}
            onChange={handleChange}
          >
            <option value="">Select year</option>
            {Array.from(
              { length: new Date().getFullYear() - 2000 + 1 },
              (_, i) => 2000 + i
            ).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          {errors.enrollmentYear && (
            <div style={{ color: "red" }}>{errors.enrollmentYear}</div>
          )}
        </div>
        <div>
          <label>Active: </label>
          <input
            name="isActive"
            type="checkbox"
            checked={student.isActive}
            onChange={(e) =>
              setStudent({ ...student, isActive: e.target.checked })
            }
          />
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Student"}
        </button>
      </form>
      {submitStatus && <p>{submitStatus}</p>}
    </div>
  );
}

export default AddStudent;
