import { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, Tooltip } from "recharts";

export default function Dashboard() {
  const [overview, setOverview] = useState(null);
  const [sites, setSites] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/overview").then(res => setOverview(res.data));
    axios.get("http://127.0.0.1:8000/sites").then(res => setSites(res.data));
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <h1 className="text-3xl mb-6 font-bold">ClinIQ Dashboard</h1>

      <div className="grid grid-cols-4 gap-6 mb-8">
        <Card title="Overall DQI" value={overview?.average_dqi} />
        <Card title="High Risk Subjects" value={overview?.high_risk_subjects} />
        <Card title="Total Subjects" value={overview?.total_subjects} />
        <Card title="Pending SAEs" value="12" />
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-slate-800 p-4 rounded-xl">
          <h2 className="mb-4">Site Performance Overview</h2>
          <BarChart width={500} height={300} data={sites.slice(0,6)}>
            <XAxis dataKey="Subject" hide />
            <Tooltip />
            <Bar dataKey="risk_score" />
          </BarChart>
        </div>

        <div className="bg-slate-800 p-4 rounded-xl">
          <h2>AI Insights</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li>High unresolved issues detected in 5 subjects</li>
            <li>Recommend CRA review for Subject 78</li>
            <li>Potential coding backlog in WHO-DD file</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-slate-800 rounded-xl p-4 text-center">
      <h3 className="text-gray-400">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}
