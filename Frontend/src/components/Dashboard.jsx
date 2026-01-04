import { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, Tooltip } from "recharts";

export default function Dashboard() {
  const [overview, setOverview] = useState(null);
  const [sites, setSites] = useState([]);

  const visibleSites = sites.slice(0,6);

const highestRisk = visibleSites.reduce((a, b) => a.risk_score > b.risk_score ? a : b, {});
const bestSubject = visibleSites.reduce((a, b) => a.risk_score < b.risk_score ? a : b, {});
const avgRisk = Math.round(
  visibleSites.reduce((sum, s) => sum + s.risk_score, 0) / (visibleSites.length || 1)
);


  useEffect(() => {
    axios.get("http://127.0.0.1:8000/overview").then(res => setOverview(res.data));
    axios.get("http://127.0.0.1:8000/sites").then(res => setSites(res.data));
  }, []);

  const CleanTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="cliniq-tooltip">
      <div className="cliniq-tooltip-title">{label}</div>
      <div className="cliniq-tooltip-value">
        Risk Score: <span>{payload[0].value}%</span>
      </div>
    </div>
  );
};


  return (
    <div className="min-h-screen bg-background bg-slate-900 text-white">

      <div className="p-6">
        <h1 className="p-6-heading">Dashboard</h1>

        <div className="container-fluid mt-4">
          <div className="row g-4">
            <div className="col-12 col-md-3"><Card title="Overall DQI" value={overview?.average_dqi} /></div>
            <div className="col-12 col-md-3"><Card title="High Risk Subjects" value={overview?.high_risk_subjects} /></div>
            <div className="col-12 col-md-3"><Card title="Total Subjects" value={overview?.total_subjects} /></div>
            <div className="col-12 col-md-3"><Card title="Pending SAEs" value="12" /></div>
          </div>
        </div>

        <div className="cliniq-site-grid">

<div className="cliniq-site-graph">

  <div className="site-graph-layout">

    {/* BAR GRAPH */}
    <div>
      <div className="site-module-title">Site Performance Overview</div>
      <BarChart width={420} height={260} data={sites.slice(0,6)}>
        <XAxis dataKey="Subject" tick={{ fill: "#94a3b8", fontSize: 11 }} />
        <Tooltip content={<CleanTooltip />} cursor={false} />
        <Bar dataKey="risk_score" fill="#38bdf8" activeBar={false} />
      </BarChart>
    </div>

    {/* AI INSIGHTS PANEL */}
<div className="site-insights">
  <div className="insight-title">Top Risk Insights</div>

  <p>🔴 Highest Risk: <span>{highestRisk.Subject}</span></p>
  <p>🟡 Avg Risk: <span>{avgRisk}%</span></p>
  <p>🟢 Best Subject: <span>{bestSubject.Subject}</span></p>
  <p>⚠ Risk Trend: <span className="text-warning">Increasing</span></p>
</div>


  </div>
</div>


          {/* TABLE BOX */}
          <div className="cliniq-site-table">

            <table className="cliniq-table">
              <thead>
                <tr className="cliniq-table-header">
                  <th>Subject</th>
                  <th>Open Issues</th>
                  <th>Risk Score</th>
                </tr>
              </thead>
              <tbody>
                {sites.slice(0,6).map((s, i) => (
                  <tr key={i} className="cliniq-table-row">
                    <td className="cliniq-table-subject">{s.Subject}</td>
                    <td className="cliniq-table-issues">
                      {s["Total Open issue Count per subject"]}
                    </td>
                    <td className="cliniq-table-risk">{s.risk_score}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="cliniq-card">
      <div className="cliniq-card-title">{title}</div>
      <p className="cliniq-card-value">{value}</p>
    </div>
  );
}
