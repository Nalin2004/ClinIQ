import { useEffect, useState } from "react";
import axios from "axios";

export default function Patient() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/patients").then(res => setPatients(res.data));
  }, []);

  const filtered = patients.filter(p =>
    p.Subject.toLowerCase().includes(search.toLowerCase()) &&
    (filter === "All" || p.risk_level === filter)
  );

  return (
    <div className="cliniq-patient-wrapper">
  <h1 className="cliniq-page-title">Patient Registry</h1>

      <div className="cliniq-patient-filters">
        <input
          placeholder="Search subject..."
          onChange={e => setSearch(e.target.value)}
        />

        <select onChange={e => setFilter(e.target.value)}>
          <option>All</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
      </div>

        <div className="cliniq-patient-card">
    <table className="cliniq-patient-table">
        <thead>
          <tr>
            <th>Subject</th>
            <th>Open Issues</th>
            <th>Risk</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((p, i) => (
            <tr key={i}>
              <td>{p.Subject}</td>
            <td>{p["Total Open issue Count per subject"]}</td>

<td>
  <span
    className={`cliniq-risk-pill ${
      p.risk_score > 70 ? "risk-high" :
      p.risk_score > 30 ? "risk-mid" :
      "risk-low"
    }`}
  >
    {p.risk_score}%
  </span>
</td>

<td>{p.risk_score > 70 ? "Review" : "Active"}</td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
     </div>
  );
}
