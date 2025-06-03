// components/CampaignHistory.js
import { useEffect, useState } from 'react';
import axios from '../utils/api';

function CampaignHistory() {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/campaign/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCampaigns(res.data);
    };
    fetchCampaigns();
  }, []);

  return (
    <div>
      <h2>Past Campaigns</h2>
      {campaigns.map(c => (
        <div key={c._id} style={{ border: '1px solid #ccc', padding: '10px' }}>
          <p><strong>ID:</strong> {c._id}</p>
          <p><strong>Status:</strong> {c.status}</p>
          <p><strong>Sent:</strong> {c.sentCount} / <strong>Failed:</strong> {c.failedCount}</p>
        </div>
      ))}
    </div>
  );
}

export default CampaignHistory;
