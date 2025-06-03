// src/components/Navbar.js
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={navStyle}>
      <div>
        <Link to="/" style={linkStyle}>Home</Link>
        {isAuthenticated && (
          <>
            <Link to="/add-customer" style={linkStyle}>Add Customer</Link>
            <Link to="/add-order" style={linkStyle}>Add Order</Link>
            <Link to="/create" style={linkStyle}>Create</Link>
            <Link to="/campaigns" style={linkStyle}>Campaigns</Link>
          </>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {isAuthenticated ? (
          <>
            {user?.picture && (
              <img
                src={user.picture}
                alt="Profile"
                style={{ width: 32, height: 32, borderRadius: "50%" }}
              />
            )}
            <span style={{ color: "#fff" }}>{user?.name}</span>
            <button onClick={handleLogout} style={btnStyle}>Logout</button>
          </>
        ) : (
          <Link to="/login" style={btnStyle}>Login</Link>
        )}
      </div>
    </nav>
  );
}

const navStyle = {
  padding: "10px 20px",
  background: "#222",
  color: "#fff",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const linkStyle = {
  marginRight: 15,
  color: "#fff",
  textDecoration: "none",
};

const btnStyle = {
  padding: "6px 12px",
  backgroundColor: "#f04",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  textDecoration: "none",
  cursor: "pointer",
};

export default Navbar;
