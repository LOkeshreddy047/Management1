import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../AuthContext";

function StudentList() {
  const { userRole } = useContext(AuthContext);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const calculateAge = (dob) => {
    if (!dob) return "";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get(
        "https://management1-55j2.onrender.com/students",
        {
          headers: { "x-user-role": userRole },
        }
      );
      // Sort by department then studentId
      const sortedStudents = response.data.sort((a, b) => {
        if (a.department < b.department) return -1;
        if (a.department > b.department) return 1;
        if (a.studentId < b.studentId) return -1;
        if (a.studentId > b.studentId) return 1;
        return 0;
      });
      setStudents(sortedStudents);
      setLoading(false);

      // Extract unique departments
      const uniqueDepartments = [...new Set(sortedStudents.map(s => s.department))];
      setDepartments(uniqueDepartments);
      setSelectedDepartment("");
      setFilteredStudents(sortedStudents);
    } catch (error) {
      alert("Error fetching students");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userRole === "admin") {
      fetchStudents();
    } else {
      setLoading(false);
    }
  }, [userRole]);

  useEffect(() => {
    if (selectedDepartment === "") {
      setFilteredStudents(students);
    } else {
      setFilteredStudents(students.filter(s => s.department === selectedDepartment));
    }
  }, [selectedDepartment, students]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await axios.delete(`http://localhost:5000/students/${id}`, {
          headers: { "x-user-role": userRole },
        });
        alert("Student deleted successfully");
        fetchStudents();
      } catch (error) {
        alert("Error deleting student");
      }
    }
  };

  if (loading) return <p>Loading students...</p>;

  if (userRole !== "admin") {
    return <p>You do not have permission to view the student list.</p>;
  }

  return (
    <div>
      <h2>Student List</h2>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingRight: "20px" }}>
        <div>
          <label htmlFor="departmentFilter">Filter by Department: </label>
          <select
            id="departmentFilter"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
        <div style={{ marginRight: "10px" }}>
          <strong>Number of Students: {filteredStudents.length}</strong>
        </div>
      </div>
      {filteredStudents.length === 0 ? (
        <p>No students found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Name</th>
              <th>Age</th>
              <th>Email</th>
              <th>Department</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student._id}>
                <td>{student.studentId}</td>
                <td>
                  {student.firstName} {student.lastName}
                </td>
                <td>{calculateAge(student.dob)}</td>
                <td>{student.email}</td>
                <td>{student.department}</td>
                <td>
                  {userRole === "admin" ? (
                    <>
                      <button
                        onClick={() => navigate(`/edit-student/${student._id}`)}
                      >
                        Edit
                      </button>{" "}
                      <button onClick={() => handleDelete(student._id)}>
                        Delete
                      </button>
                    </>
                  ) : (
                    <span>No actions available</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default StudentList;
