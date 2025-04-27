import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    // Check localStorage for auth token, role, and username
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("userRole");
    const storedUsername = localStorage.getItem("username");
    if (token && role && storedUsername) {
      setIsAuthenticated(true);
      setUserRole(role);
      setUsername(storedUsername);
    }
  }, []);

  const login = (token, role, username) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("userRole", role);
    localStorage.setItem("username", username);
    setIsAuthenticated(true);
    setUserRole(role);
    setUsername(username);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");
    setIsAuthenticated(false);
    setUserRole(null);
    setUsername(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
