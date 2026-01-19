import { useState } from "react";

export default function Patient() {

  const [form, setForm] = useState({
    name:"",
    age:"",
    country:"",
    symptoms:"",
    chronic:"",
    medications:"",
    issues:""
  });

  const [risk,setRisk]=useState(null);
  const [lessons,setLessons]=useState([]);
  const [lesson,setLesson]=useState("");

  const handle = e=>{
    setForm({...form,[e.target.name]:e.target.value});
  };

  const submit = ()=>{
    const r = form.issues * 5 + (form.chronic?10:0);
    setRisk(r);
  };

  return (
    <div className="patient-wrapper">

      <h1>🩺 Patient Clinical Questionnaire</h1>

      <div className="patient-form">
        <input name="name" placeholder="Full Name" onChange={handle}/>
        <input name="age" placeholder="Age" onChange={handle}/>
        <input name="country" placeholder="Country" onChange={handle}/>
        <textarea name="symptoms" placeholder="Describe Symptoms" onChange={handle}/>
        <textarea name="chronic" placeholder="Any chronic diseases?" onChange={handle}/>
        <textarea name="medications" placeholder="Current medications" onChange={handle}/>
        <input name="issues" type="number" placeholder="Open Issues Count" onChange={handle}/>

        <button onClick={submit}>Analyze Risk</button>
      </div>

      {risk !== null && (
        <div className="risk-card">
          <h2>⚠ Risk Score: {risk}%</h2>
          <p>Status: {risk>40?"High Risk":risk>20?"Moderate":"Low Risk"}</p>
        </div>
      )}

    </div>
  );
}
