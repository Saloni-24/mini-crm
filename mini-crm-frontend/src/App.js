// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AddCustomer from "./pages/AddCustomer";
import AddOrder from "./pages/AddOrder";
import CreateCampaign from "./pages/CreateCampaign";
import Campaigns from "./pages/Campaigns";
import LoginWithGoogle from "./components/LoginWithGoogle";

import { AuthProvider, useAuth } from "./context/AuthContext";

// PrivateRoute component for protected routes
function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <GoogleOAuthProvider clientId="1056083452714-ngbiuq08o73dilcp7ku6ib2j6fb2naac.apps.googleusercontent.com">
      <AuthProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/add-customer"
              element={
                <PrivateRoute>
                  <AddCustomer />
                </PrivateRoute>
              }
            />
            <Route
              path="/add-order"
              element={
                <PrivateRoute>
                  <AddOrder />
                </PrivateRoute>
              }
            />
            <Route
              path="/create"
              element={
                <PrivateRoute>
                  <CreateCampaign />
                </PrivateRoute>
              }
            />
            <Route
              path="/campaigns"
              element={
                <PrivateRoute>
                  <Campaigns />
                </PrivateRoute>
              }
            />
            <Route path="/login" element={<LoginWithGoogle />} />
          </Routes>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
