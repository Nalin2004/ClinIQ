import { useState } from "react";

export default function Support() {

  const [tickets,setTickets] = useState([]);
  const [issue,setIssue] = useState("");
  const [role,setRole] = useState("Patient");

  return (
    <div className="support-wrapper">

      <h1>🤝 ClinIQ Support & Engagement Hub</h1>

      <div className="support-cards">

        <div className="support-card">
          <h3>👨‍⚕️ For Healthcare Professionals</h3>
          <ul>
            <li>Automated follow-up reminders for critical patients</li>
            <li>Priority tagging for missed visits</li>
            <li>Access to cross-country best practices</li>
            <li>Real-time patient risk trend tracking</li>
          </ul>
        </div>

        <div className="support-card">
          <h3>🧑‍🦽 For Patients</h3>
          <ul>
            <li>Simple appointment reminders</li>
            <li>Follow-up importance education</li>
            <li>Direct support access for care queries</li>
            <li>Improved engagement through notifications</li>
          </ul>
        </div>

      </div>

      <div className="support-ticket">
        <h2>📨 Raise a Support Request</h2>

        <select onChange={e=>setRole(e.target.value)}>
          <option>Patient</option>
          <option>Healthcare Professional</option>
        </select>

        <textarea
          placeholder="Describe your concern or follow-up issue..."
          onChange={e=>setIssue(e.target.value)}
        />

        <button onClick={()=>{
          if(issue.trim()){
            setTickets([...tickets,{role,issue}]);
            setIssue("");
          }
        }}>
          Submit Request
        </button>

        {tickets.map((t,i)=>(
          <div key={i} className="ticket">
            <b>{t.role}:</b> {t.issue}
          </div>
        ))}
      </div>

    </div>
  );
}
