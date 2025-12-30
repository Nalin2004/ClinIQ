import { useEffect, useState } from "react";

function App() {
  const [overview, setOverview] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [sites, setSites] = useState([]);
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/overview")
      .then(res => res.json())
      .then(setOverview);

    fetch("http://127.0.0.1:8000/subjects")
      .then(res => res.json())
      .then(data => setSubjects(data.subjects));

    fetch("http://127.0.0.1:8000/sites")
      .then(res => res.json())
      .then(setSites);
  }, []);

  const loadPatient = (subject) => {
    fetch(`http://127.0.0.1:8000/patient?subject=${encodeURIComponent(subject)}`)
      .then(res => res.json())
      .then(setPatient);
  };

  return (
    <div style={{ padding: 30, fontFamily: "Arial" }}>
      <h1>ClinIQ Dashboard</h1>

      {overview && (
        <div>
          <b>Average DQI:</b> {overview.average_dqi} |
          <b> High Risk Subjects:</b> {overview.high_risk_subjects} |
          <b> Total Subjects:</b> {overview.total_subjects}
        </div>
      )}

      <hr />

      <h2>Subjects</h2>
      <ul>
        {subjects.map((s, i) => (
          <li key={i}>
            <button onClick={() => loadPatient(s)}>{s}</button>
          </li>
        ))}
      </ul>

      {patient && (
        <div>
          <h3>Patient Drilldown</h3>
          <p><b>Subject:</b> {patient.subject}</p>
          <p><b>Open Issues:</b> {patient.open_issues}</p>
          <p><b>DQI:</b> {patient.dqi}</p>
        </div>
      )}

      <hr />

      <h2>Site / Subject Risk Performance</h2>

      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>Subject</th>
            <th>Open Issues</th>
            <th>Uncoded MedDRA</th>
            <th>Uncoded WHO Drug</th>
            <th>Risk Score</th>
          </tr>
        </thead>
        <tbody>
          {sites.map((s, i) => (
            <tr key={i}>
              <td>{s.Subject}</td>
              <td>{s["Total Open issue Count per subject"]}</td>
              <td>{s.uncoded_meddra}</td>
              <td>{s.uncoded_whodd}</td>
              <td><b>{s.risk_score}</b></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
