import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Register() {
  const [registerData, setRegisterData] = useState({
    username: "",
    password: "",
    role: "student",
  });
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!registerData.username) newErrors.username = "Username is required";
    if (!registerData.password) newErrors.password = "Password is required";
    if (!registerData.role) newErrors.role = "Role is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setSubmitStatus("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitStatus("");
    try {
      const response = await axios.post(
        "http://localhost:5000/auth/register",
        {
          username: registerData.username,
          password: registerData.password,
          role: registerData.role,
        }
      );

      if (response.data.success) {
        setSubmitStatus("Registration successful! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        setSubmitStatus("Registration failed: " + response.data.message);
      }
    } catch (error) {
      setSubmitStatus("Error during registration: " + (error.response?.data?.message || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div>
          <label>Username: </label>
          <input
            name="username"
            value={registerData.username}
            onChange={handleChange}
          />
          {errors.username && (
            <div style={{ color: "red" }}>{errors.username}</div>
          )}
        </div>
        <div>
          <label>Password: </label>
          <input
            name="password"
            type="password"
            value={registerData.password}
            onChange={handleChange}
          />
          {errors.password && (
            <div style={{ color: "red" }}>{errors.password}</div>
          )}
        </div>
        <div>
          <label>Role: </label>
          <select name="role" value={registerData.role} onChange={handleChange}>
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>
          {errors.role && <div style={{ color: "red" }}>{errors.role}</div>}
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Registering..." : "Register"}
        </button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login here</Link>.
      </p>
      {submitStatus && <p>{submitStatus}</p>}
    </div>
  );
}

export default Register;
