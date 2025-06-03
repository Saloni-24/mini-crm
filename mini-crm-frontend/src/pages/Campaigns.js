import React, { useEffect, useState } from "react";

function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/campaigns", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("API response:", data);

        if (Array.isArray(data)) {
          // Agar backend seedha array return karta hai
          setCampaigns(data);
        } else if (data.campaigns) {
          // Agar backend object mein campaigns array bhej raha hai
          setCampaigns(data.campaigns);
        } else {
          setCampaigns([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching campaigns:", err);
        setCampaigns([]);
      });
  }, []);

  return (
    <div>
      <h2>Campaigns</h2>
      <ul>
        {campaigns.length > 0 ? (
          campaigns.map((camp) => <li key={camp._id}>{camp.name}</li>)
        ) : (
          <li>No campaigns available</li>
        )}
      </ul>
    </div>
  );
}

export default Campaigns;
