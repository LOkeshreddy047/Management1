import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../AuthContext";

function Login() {
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
    role: "student", // default role
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const validate = () => {
    const newErrors = {};
    if (!loginData.username) newErrors.username = "Username is required";
    if (!loginData.password) newErrors.password = "Password is required";
    if (!loginData.role) newErrors.role = "Role is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setSubmitStatus("");
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitStatus("");
    try {
      const response = await axios.post(
        `http://localhost:5000/auth/login`,
        {
          username: loginData.username,
          password: loginData.password,
          role: loginData.role,
        }
      );

      if (response.data.success) {
        setSubmitStatus("Login successful!");
        login(response.data.token, loginData.role, loginData.username);
        if (loginData.role === "student") {
          navigate("/students");
        } else if (loginData.role === "admin") {
          navigate("/admin");
        }
      } else {
        setSubmitStatus("Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      setSubmitStatus("Error during login: " + (error.response?.data?.message || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div>
          <label>Username: </label>
          <input
            name="username"
            value={loginData.username}
            onChange={handleChange}
          />
          {errors.username && (
            <div style={{ color: "red" }}>{errors.username}</div>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <label>Password: </label>
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            value={loginData.password}
            onChange={handleChange}
            style={{ marginRight: "8px" }}
          />
          <button
            type="button"
            onClick={toggleShowPassword}
            style={{ height: "30px", padding: "0 8px" }}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
          {errors.password && (
            <div style={{ color: "red", marginLeft: "8px" }}>{errors.password}</div>
          )}
        </div>
        <div>
          <label>Role: </label>
          <select name="role" value={loginData.role} onChange={handleChange}>
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>
          {errors.role && <div style={{ color: "red" }}>{errors.role}</div>}
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>
      <p>
        Don't have an account? <Link to="/register">Register here</Link>.
      </p>
      {submitStatus && <p>{submitStatus}</p>}
    </div>
  );
}

export default Login;
