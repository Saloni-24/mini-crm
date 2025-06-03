import { useEffect, useState } from "react";
import axios from "axios";

function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [logs, setLogs] = useState(null);
  const [logsLoading, setLogsLoading] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/campaigns", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCampaigns(res.data);
      } catch (err) {
        setError("Failed to fetch campaigns");
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  const fetchDeliveryLogs = async (campaignId) => {
    setLogsLoading(true);
    setSelectedCampaignId(campaignId);
    setLogs(null);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`/api/campaigns/${campaignId}/delivery-logs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLogs(res.data);
    } catch (err) {
      setLogs({ error: "Failed to load delivery logs." });
    } finally {
      setLogsLoading(false);
    }
  };

  if (loading) return <p>Loading campaigns...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Campaign History</h2>
      {campaigns.length === 0 ? (
        <p>No campaigns found.</p>
      ) : (
        campaigns.map((c) => (
          <div
            key={c._id}
            style={{
              border: "1px solid #ddd",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "6px",
            }}
          >
            <h3>{c.name || "Untitled Campaign"}</h3>
            <p>
              <strong>Audience Size:</strong> {c.audience?.length || 0}
            </p>
            <p>
              <strong>Sent:</strong> {c.stats?.sent || 0} |{" "}
              <strong>Failed:</strong> {c.stats?.failed || 0}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(c.createdAt).toLocaleString("en-IN")}
            </p>
            <button onClick={() => fetchDeliveryLogs(c._id)}>
              {selectedCampaignId === c._id && logsLoading
                ? "Loading Logs..."
                : "View Delivery Logs"}
            </button>

            {/* Show logs for selected campaign */}
            {selectedCampaignId === c._id && logs && (
              <div style={{ marginTop: "10px", fontSize: "0.9em" }}>
                {logs.error ? (
                  <p style={{ color: "red" }}>{logs.error}</p>
                ) : logs.length === 0 ? (
                  <p>No delivery logs found.</p>
                ) : (
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        <th style={{ border: "1px solid #ccc", padding: "4px" }}>
                          Customer
                        </th>
                        <th style={{ border: "1px solid #ccc", padding: "4px" }}>
                          Status
                        </th>
                        <th style={{ border: "1px solid #ccc", padding: "4px" }}>
                          Timestamp
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {logs.map((log) => (
                        <tr key={log._id}>
                          <td style={{ border: "1px solid #ccc", padding: "4px" }}>
                            {log.customerName || log.customerId}
                          </td>
                          <td style={{ border: "1px solid #ccc", padding: "4px" }}>
                            {log.status}
                          </td>
                          <td style={{ border: "1px solid #ccc", padding: "4px" }}>
                            {new Date(log.updatedAt).toLocaleString("en-IN")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default Campaigns;
