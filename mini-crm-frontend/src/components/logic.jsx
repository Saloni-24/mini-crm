import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

const Login = () => {
  const handleSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;
    console.log("Google Token:", token);

    try {
      // Backend ko token bhejo, jo verify karega aur user login karega
      const res = await axios.post("/api/user/google-login", { token });
      console.log("User logged in:", res.data);
      // Yahan JWT token save kar sakte ho ya user ko dashboard redirect kar sakte ho
      localStorage.setItem("token", res.data.token);
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
    }
  };

  return (
    <div style={{ maxWidth: 300, margin: "auto", textAlign: "center", marginTop: "100px" }}>
      <h2>Login with Google</h2>
      <GoogleLogin onSuccess={handleSuccess} onError={() => console.log("Login Failed")} />
    </div>
  );
};

export default Login;
