import React, { useEffect, useState } from "react";
import api from "../api/axios.js";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/dashboard")
      .then((res) => setStats(res.data))
      .catch((err) => setError(err.response?.data?.message || "Dashboard load failed"));
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (!stats) return <p>Loading dashboard...</p>;

  const cards = [
    ["Total Projects", stats.totalProjects],
    ["Total Tasks", stats.totalTasks],
    ["Pending", stats.pendingTasks],
    ["In Progress", stats.inProgressTasks],
    ["Completed", stats.completedTasks],
    ["Overdue", stats.overdueTasks],
  ];

  return (
    <section>
      <h1>Dashboard</h1>
      <div className="grid">
        {cards.map(([label, value]) => (
          <div className="card" key={label}>
            <h3>{label}</h3>
            <p className="big">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
