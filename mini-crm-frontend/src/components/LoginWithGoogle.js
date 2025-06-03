// src/components/LoginWithGoogle.js
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function LoginWithGoogle() {
  const { login } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="login">
      <h2>Login to CRM</h2>
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          login(credentialResponse.credential); // call context login
          navigate("/"); // redirect to homepage
        }}
        onError={() => {
          console.log("Login Failed");
        }}
      />
    </div>
  );
}

export default LoginWithGoogle;
