import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../AuthContext";

function StudentProfile() {
  const { userRole, username } = useContext(AuthContext);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await axios.get("http://localhost:5000/students", {
          headers: { "x-user-role": userRole, "x-username": username },
        });
        if (response.data && response.data.length > 0) {
          setStudent(response.data[0]);
        }
      } catch (error) {
        console.error("Error fetching student profile:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userRole === "student") {
      fetchStudent();
    } else {
      setLoading(false);
    }
  }, [userRole, username]);

  if (loading) return <p>Loading profile...</p>;

  if (!student) return <p>No profile data found.</p>;

  return (
    <div>
      <h2>My Profile</h2>
      <p><strong>Roll Number:</strong> {student.studentId}</p>
      <p><strong>Name:</strong> {student.firstName} {student.lastName}</p>
      <p><strong>Date of Birth:</strong> {new Date(student.dob).toLocaleDateString()}</p>
      <p><strong>Department:</strong> {student.department}</p>
      <p><strong>Active:</strong> {student.isActive ? "Yes" : "No"}</p>
    </div>
  );
}

export default StudentProfile;
