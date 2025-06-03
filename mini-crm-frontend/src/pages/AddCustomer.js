import React, { useState } from "react";

function AddCustomer() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const customerData = { name, email };

    fetch("http://localhost:5000/api/customers", {  
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`, 
      },
      body: JSON.stringify(customerData),
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Customer added successfully!");
        setName("");
        setEmail("");
      })
      .catch((err) => {
        console.error("Error adding customer:", err);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        required
      />
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        type="email"
        required
      />
      <button type="submit">Add Customer</button>
    </form>
  );
}

export default AddCustomer;
