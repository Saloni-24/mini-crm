// src/pages/AddCustomer.js
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function AddCustomer() {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ name, email }),
      });

      if (res.ok) {
        setMessage("Customer added successfully!");
        setName("");
        setEmail("");
      } else {
        const data = await res.json();
        setMessage("Error: " + data.message);
      }
    } catch (err) {
      setMessage("Network error.");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Add Customer</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: "100%", marginBottom: 10 }}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", marginBottom: 10 }}
          />
        </label>
        <button type="submit">Add Customer</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default AddCustomer;
