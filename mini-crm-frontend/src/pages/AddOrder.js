// src/pages/AddOrder.js
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function AddOrder() {
  const { user } = useAuth();
  const [customerId, setCustomerId] = useState("");
  const [orderDetails, setOrderDetails] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ customerId, orderDetails }),
      });

      if (res.ok) {
        setMessage("Order added successfully!");
        setCustomerId("");
        setOrderDetails("");
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
      <h2>Add Order</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
        <label>
          Customer ID:
          <input
            type="text"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            required
            style={{ width: "100%", marginBottom: 10 }}
          />
        </label>
        <label>
          Order Details:
          <textarea
            value={orderDetails}
            onChange={(e) => setOrderDetails(e.target.value)}
            required
            style={{ width: "100%", marginBottom: 10 }}
          />
        </label>
        <button type="submit">Add Order</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default AddOrder;
