import { useEffect, useState } from "react";

function App() {
  const [overview, setOverview] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [selected, setSelected] = useState(null);
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/overview")
      .then(res => res.json())
      .then(data => setOverview(data));

    fetch("http://127.0.0.1:8000/subjects")
      .then(res => res.json())
      .then(data => setSubjects(data.subjects));
  }, []);

  const loadPatient = (subject) => {
    setSelected(subject);
    fetch(`http://127.0.0.1:8000/patient?subject=${encodeURIComponent(subject)}`)
      .then(res => res.json())
      .then(data => setPatient(data));
  };

  return (
    <div style={{ padding: 30, fontFamily: "sans-serif" }}>
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

      <div style={{ display: "flex" }}>
        <ul style={{ width: "40%" }}>
          {subjects.map((s, i) => (
            <li key={i}>
              <button onClick={() => loadPatient(s)}>
                {s}
              </button>
            </li>
          ))}
        </ul>

        {patient && (
          <div style={{ marginLeft: 40 }}>
            <h3>Patient Details</h3>
            <p><b>Subject:</b> {patient.subject}</p>
            <p><b>Open Issues:</b> {patient.open_issues}</p>
            <p><b>DQI:</b> {patient.dqi}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
