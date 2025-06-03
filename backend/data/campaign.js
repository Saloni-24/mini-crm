import React, { useEffect, useState } from "react";

function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/campaigns", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setCampaigns(data.campaigns || []); // important: access data.campaigns here
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching campaigns:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading campaigns...</p>;

  return (
    <div>
      <h2>Campaigns</h2>
      {campaigns.length === 0 ? (
        <p>No campaigns available</p>
      ) : (
        <table border="1" cellPadding="5" cellSpacing="0">
          <thead>
            <tr>
              <th>Name</th>
              <th>Audience Size</th>
              <th>Status</th>
              <th>Sent</th>
              <th>Failed</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((camp) => (
              <tr key={camp._id}>
                <td>{camp.name}</td>
                <td>{camp.audienceSize}</td>
                <td>{camp.status}</td>
                <td>{camp.sent}</td>
                <td>{camp.failed}</td>
                <td>{new Date(camp.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Campaigns;
