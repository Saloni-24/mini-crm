// src/pages/CreateCampaign.js
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

// Simple condition component
function Condition({ condition, onChange, onRemove }) {
  return (
    <div style={{ marginBottom: 10, border: "1px solid #ccc", padding: 10 }}>
      <select
        value={condition.field}
        onChange={(e) => onChange({ ...condition, field: e.target.value })}
      >
        <option value="spend">Spend</option>
        <option value="visits">Visits</option>
        <option value="inactiveDays">Inactive Days</option>
      </select>

      <select
        value={condition.operator}
        onChange={(e) => onChange({ ...condition, operator: e.target.value })}
      >
        <option value=">">&gt;</option>
        <option value="<">&lt;</option>
        <option value="=">=</option>
      </select>

      <input
        type="number"
        value={condition.value}
        onChange={(e) => onChange({ ...condition, value: Number(e.target.value) })}
        style={{ width: 80 }}
      />

      <button onClick={onRemove} style={{ marginLeft: 10 }}>
        Remove
      </button>
    </div>
  );
}

function CreateCampaign() {
  const { user } = useAuth();
  const [conditions, setConditions] = useState([
    { field: "spend", operator: ">", value: 10000 },
  ]);
  const [logic, setLogic] = useState("AND");
  const [audienceSize, setAudienceSize] = useState(null);
  const [message, setMessage] = useState("");

  const addCondition = () => {
    setConditions([...conditions, { field: "spend", operator: ">", value: 0 }]);
  };

  const updateCondition = (index, newCondition) => {
    const newConditions = [...conditions];
    newConditions[index] = newCondition;
    setConditions(newConditions);
  };

  const removeCondition = (index) => {
    const newConditions = [...conditions];
    newConditions.splice(index, 1);
    setConditions(newConditions);
  };

  // API call to preview audience size based on rules
  const previewAudience = async () => {
    try {
      const res = await fetch("/api/campaigns/preview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ conditions, logic }),
      });
      if (res.ok) {
        const data = await res.json();
        setAudienceSize(data.audienceSize);
        setMessage("");
      } else {
        const data = await res.json();
        setMessage("Error: " + data.message);
      }
    } catch (err) {
      setMessage("Network error");
    }
  };

  // Save campaign API call
  const saveCampaign = async () => {
    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ conditions, logic }),
      });
      if (res.ok) {
        setMessage("Campaign saved successfully!");
        setAudienceSize(null);
      } else {
        const data = await res.json();
        setMessage("Error: " + data.message);
      }
    } catch (err) {
      setMessage("Network error");
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 600 }}>
      <h2>Create Campaign</h2>
      {conditions.map((cond, i) => (
        <Condition
          key={i}
          condition={cond}
          onChange={(c) => updateCondition(i, c)}
          onRemove={() => removeCondition(i)}
        />
      ))}

      <div style={{ marginBottom: 10 }}>
        <button onClick={addCondition}>Add Condition</button>
      </div>

      <div style={{ marginBottom: 10 }}>
        <label>
          Logic between conditions:
          <select value={logic} onChange={(e) => setLogic(e.target.value)}>
            <option value="AND">AND</option>
            <option value="OR">OR</option>
          </select>
        </label>
      </div>

      <button onClick={previewAudience} style={{ marginRight: 10 }}>
        Preview Audience Size
      </button>
      <button onClick={saveCampaign}>Save Campaign</button>

      {audienceSize !== null && <p>Audience Size: {audienceSize}</p>}
      {message && <p>{message}</p>}
    </div>
  );
}

export default CreateCampaign;
