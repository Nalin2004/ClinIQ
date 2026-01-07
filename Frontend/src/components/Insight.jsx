import { useEffect, useState } from "react";
import api from "../api";
import { BarChart, Bar, XAxis, Tooltip } from "recharts";

const DarkTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="cliniq-tooltip">
        <p className="cliniq-tooltip-title">{label}</p>
        <p className="cliniq-tooltip-value">{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export default function AIInsights() {
  const [ai, setAi] = useState(null);

  useEffect(() => {
    api.get("/ai-insights")
      .then(res => setAi(res.data))
      .catch(err => console.log("AI error:", err));
  }, []);

  
  if (!ai) {
  return (
    <div className="ai-container ai-loading-screen">
      <div className="ai-loader">
        Analyzing clinical signals…
      </div>
    </div>
  );
}


  // 💣 SAFETY NET — never allow undefined
  const alerts = Array.isArray(ai.alerts) ? ai.alerts : [];
  const reasons = Array.isArray(ai.reasons) ? ai.reasons : [];
  const actions = Array.isArray(ai.recommended_actions) ? ai.recommended_actions : [];
  const graph = Array.isArray(ai.graph) ? ai.graph : [];

  return (
    <div className="ai-container">
      <h1 className="ai-title">AI Intelligence Feed</h1>

      <div className="ai-grid">

        {/* Predictive Analytics */}
        <div className="ai-card ai-predictive">
          <h3>Predictive Analytics</h3>
          <div className="ai-readmission">
            <span className="ai-readmission-value">{ai.readmission_risk || 0}%</span>
            <span className="ai-readmission-text">High Probability of Readmission</span>
          </div>
          <div className="ai-progress">
            <div
              className="ai-progress-fill"
              style={{ width: `${ai.readmission_risk || 0}%` }}
            ></div>
          </div>
        </div>

        {/* Risk Drivers Graph */}
        <div className="ai-card ai-risk-factors">
          <h3>📊 Risk Drivers</h3>

          <BarChart width={420} height={240} data={graph}>
            <XAxis dataKey="factor" tick={{ fill: "#94a3b8", fontSize: 12 }} />
            <Tooltip content={<DarkTooltip />} cursor={{ fill: "transparent" }} />
            <Bar dataKey="value" fill="#38bdf8" radius={[6,6,0,0]} />
          </BarChart>
        </div>

        {/* Alerts */}
        <div className="ai-card ai-alerts">
          <h3>🚨 High Risk Alerts</h3>
          {alerts.length === 0 && <div className="ai-empty">No alerts detected</div>}
          {alerts.map((a, i) => (
            <div key={i} className="ai-alert-item">{a}</div>
          ))}
        </div>

        {/* Reasons */}
        <div className="ai-card ai-reasons">
          <h3>🧠 AI Risk Reasoning</h3>
          {reasons.length === 0 && <div className="ai-empty">No risk drivers identified</div>}
          {reasons.map((r, i) => (
            <div key={i} className="ai-reason">{r}</div>
          ))}
        </div>

        {/* Actions */}
        <div className="ai-card ai-actions">
          <h3>🛠 Recommended Actions</h3>
          {actions.length === 0 && <div className="ai-empty">No action required</div>}
          {actions.map((a, i) => (
            <div key={i} className="ai-action">{a}</div>
          ))}
        </div>

      </div>
    </div>
  );
}
