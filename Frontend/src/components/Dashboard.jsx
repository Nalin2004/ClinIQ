import { useEffect, useState } from "react";
import api from "../api";
import { BarChart, Bar, XAxis, Tooltip } from "recharts";
import { useTranslation } from "react-i18next";

export default function Dashboard() {
  const [overview, setOverview] = useState(null);
  const [sites, setSites] = useState([]);
  const [patients, setPatients] = useState([]);
  const {t} = useTranslation();
  const visibleSites = sites.slice(0, 6);
  const visiblePatients = patients.slice(0, 6);

  const highestRisk = visiblePatients.length
    ? visiblePatients.reduce((a, b) => a.risk_score > b.risk_score ? a : b)
    : null;

  const bestSubject = visiblePatients.length
    ? visiblePatients.reduce((a, b) => a.risk_score < b.risk_score ? a : b)
    : null;

  const avgRisk = visiblePatients.length
    ? Math.round(
        visiblePatients.reduce((sum, s) => sum + s.risk_score, 0) /
          visiblePatients.length
      )
    : 0;

  const fetchData = async () => {
    const ov = await api.get("/overview");
    const st = await api.get("/sites");
    const pt = await api.get("/patients");

    setOverview(ov.data);
    setSites(st.data);
    setPatients(pt.data);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
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
    <div className="min-h-screen bg-background bg-slate-900 text-white p-6">

      <h1 className="p-6-heading">Dashboard</h1>

      {/* TOP STATS */}
      <div className="container-fluid mt-4">
        <div className="row g-4">
          <div className="col-md-3"><Card title="Overall DQI" value={overview?.average_dqi ?? "-"} /></div>
          <div className="col-md-3"><Card title="High Risk Subjects" value={overview?.high_risk_subjects ?? "-"} /></div>
          <div className="col-md-3"><Card title="Total Subjects" value={overview?.total_subjects ?? "-"} /></div>
          <div className="col-md-3"><Card title="Pending SAEs" value="12" /></div>
        </div>
      </div>

      {/* GRAPH + INSIGHTS */}
      <div className="cliniq-site-grid">

        <div className="cliniq-site-graph">
          <div className="site-graph-layout">

            <div>
              <div className="site-module-title">Site Performance Overview</div>
              <BarChart width={420} height={260} data={visibleSites}>
                <XAxis dataKey="Subject" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <Tooltip content={<CleanTooltip />} />
                <Bar dataKey="risk_score" fill="#38bdf8" />
              </BarChart>
            </div>

            {/* 🔥 THIS BOX WAS MISSING */}
            <div className="site-insights">
              <div className="insight-title">Top Risk Insights</div>
              <p>🔴 Highest Risk: <span>{highestRisk?.Subject || "-"}</span></p>
              <p>🟡 Avg Risk: <span>{avgRisk}%</span></p>
              <p>🟢 Best Subject: <span>{bestSubject?.Subject || "-"}</span></p>
              <p>⚠ Risk Trend: <span className="text-warning">Increasing</span></p>
            </div>

          </div>
        </div>

        {/* 🔥 THIS TABLE BOX WAS MISSING */}
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
              {visiblePatients.map((p, i) => (
                <tr key={i} className="cliniq-table-row">
                  <td>{p.Subject}</td>
                  <td>{p["Total Open issue Count per subject"]}</td>
                  <td>{p.risk_score}%</td>
                </tr>
              ))}
            </tbody>
          </table>
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
