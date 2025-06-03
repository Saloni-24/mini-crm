// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from 'jwt-decode';


const AuthContext = createContext();
let logoutTimer = null;

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const setLogoutTimer = (exp) => {
    const expiryTimeInMs = exp * 1000 - Date.now();
    if (expiryTimeInMs > 0) {
      logoutTimer = setTimeout(() => {
        logout();
        alert("Session expired. Please log in again.");
      }, expiryTimeInMs);
    }
  };

  const login = (token) => {
    localStorage.setItem("token", token);
    const decoded = jwtDecode(token);

    setUser(decoded);
    setIsAuthenticated(true);
    setLogoutTimer(decoded.exp); // setup auto logout
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
    if (logoutTimer) clearTimeout(logoutTimer);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          logout(); // token already expired
        } else {
          setUser(decoded);
          setIsAuthenticated(true);
          setLogoutTimer(decoded.exp);
        }
      } catch (err) {
        console.error("Invalid token", err);
        logout();
      }
    }
    // eslint-disable-next-line
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
