import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function EditStudent() {
  const { id } = useParams();
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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await axios.get(
          `https://management1-55j2.onrender.com/students/${id}`
        );
        setStudent({
          studentId: response.data.studentId || "",
          firstName: response.data.firstName || "",
          lastName: response.data.lastName || "",
          email: response.data.email || "",
          dob: response.data.dob || "",
          department: response.data.department || "",
          enrollmentYear: response.data.enrollmentYear || "",
          isActive: response.data.isActive !== undefined ? response.data.isActive : true,
        });
      } catch (error) {
        alert("Error fetching student data");
      }
    };
    fetchStudent();
  }, [id]);

  const validate = () => {
    const newErrors = {};

    if (!student.studentId) newErrors.studentId = "Student ID is required";
    else if (!/^[a-zA-Z0-9]+$/.test(student.studentId))
      newErrors.studentId = "Student ID must be alphanumeric";

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
    const { name, value, type, checked } = e.target;
    setStudent({
      ...student,
      [name]: type === "checkbox" ? checked : value,
    });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await axios.put(`https://https://management1-55j2.onrender.com/students/${id}`, {
        studentId: student.studentId,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        dob: student.dob,
        department: student.department,
        enrollmentYear: Number(student.enrollmentYear),
        isActive: student.isActive,
      });
      alert("Student updated successfully");
      navigate("/students");
    } catch (error) {
      alert("Error updating student");
    }
  };

  return (
    <div>
      <h2>Edit Student</h2>
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
          />
          {errors.dob && <div style={{ color: "red" }}>{errors.dob}</div>}
        </div>
        <div>
          <label>Department: </label>
          <input
            name="department"
            value={student.department}
            onChange={handleChange}
          />
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
            onChange={handleChange}
          />
        </div>
        <button type="submit">Update Student</button>
      </form>
    </div>
  );
}

export default EditStudent;
