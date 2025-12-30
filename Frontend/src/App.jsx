import { useEffect, useState } from "react";

function App() {
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/overview")
      .then(res => res.json())
      .then(data => setOverview(data));
  }, []);

  return (
    <div style={{ padding: 30 }}>
      <h1>ClinIQ Dashboard</h1>

      {!overview && <p>Loading...</p>}

      {overview && (
        <div>
          <p>Average DQI: {overview.average_dqi}</p>
          <p>High Risk Subjects: {overview.high_risk_subjects}</p>
          <p>Total Subjects: {overview.total_subjects}</p>
        </div>
      )}
    </div>
  );
}

export default App;
