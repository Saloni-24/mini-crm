// src/pages/Campaigns.js
import { useEffect, useState } from "react";
import axios from '../utils/api';
import { useAuth } from "../context/AuthContext";

function Campaigns() {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/campaigns', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCampaigns(res.data);
      } catch (err) {
        console.error("Failed to fetch campaigns", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  if (loading) return <p>Loading campaigns...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Campaign History</h2>
      {campaigns.length === 0 && <p>No campaigns found.</p>}

      <table border="1" cellPadding="8" cellSpacing="0" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Campaign ID</th>
            <th>Audience Size</th>
            <th>Sent</th>
            <th>Failed</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((c) => (
            <tr key={c._id}>
              <td>{c._id}</td>
              <td>{c.audienceSize}</td>
              <td>{c.sentCount}</td>
              <td>{c.failedCount}</td>
              <td>{new Date(c.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Campaigns;
