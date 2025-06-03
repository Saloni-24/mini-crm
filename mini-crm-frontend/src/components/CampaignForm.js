// components/CampaignForm.js
import { useState } from 'react';
import axios from '../utils/api';

function CampaignForm() {
  const [rules, setRules] = useState([{ field: '', operator: '', value: '' }]);
  const [logic, setLogic] = useState('AND');

  const addRule = () => setRules([...rules, { field: '', operator: '', value: '' }]);

  const handleChange = (i, e) => {
    const newRules = [...rules];
    newRules[i][e.target.name] = e.target.value;
    setRules(newRules);
  };

  const submitCampaign = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/campaign/create', {
        rules, logic
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Campaign Created ');
    } catch (error) {
      console.log(error);
      alert('Failed to create campaign 😓');
    }
  };

  return (
    <div>
      <h2>Create Campaign</h2>
      {rules.map((rule, i) => (
        <div key={i}>
          <select name="field" onChange={(e) => handleChange(i, e)}>
            <option value="">Select Field</option>
            <option value="spend">Spend</option>
            <option value="visits">Visits</option>
            <option value="lastActive">Last Active</option>
          </select>
          <select name="operator" onChange={(e) => handleChange(i, e)}>
            <option value="">Operator</option>
            <option value=">"></option>
            <option value="<">{'<'}</option>
            <option value="=">=</option>
          </select>
          <input name="value" onChange={(e) => handleChange(i, e)} placeholder="Value" />
        </div>
      ))}
      <button onClick={addRule}>➕ Add Rule</button>
      <select value={logic} onChange={(e) => setLogic(e.target.value)}>
        <option value="AND">AND</option>
        <option value="OR">OR</option>
      </select>
      <button onClick={submitCampaign}> Launch Campaign</button>
    </div>
  );
}

export default CampaignForm;
