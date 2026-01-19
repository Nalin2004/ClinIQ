import { useEffect, useState } from "react";
import api from "../api";

export default function Followups() {
  const [data,setData] = useState([]);
  const [globalLessons,setGlobalLessons] = useState([]);
  const [lesson,setLesson] = useState("");

  useEffect(()=>{
    api.get("/followups").then(res=>setData(res.data));
  },[]);

  return (
    <div className="followup-wrapper">

      <h1>📅 Clinical Follow-Up Management</h1>

      <table className="followup-table">
        <thead>
          <tr>
            <th>Subject</th>
            <th>Next Visit</th>
            <th>Status</th>
            <th>Risk Priority</th>
          </tr>
        </thead>

        <tbody>
          {data.map((d,i)=>(
            <tr key={i}>
              <td>{d.Subject}</td>
              <td>{d.next_followup.slice(0,10)}</td>
              <td className={d.status==="Missed"?"missed":"pending"}>
                {d.status}
              </td>
              <td className={d.risk_score>40?"critical":"normal"}>
                {d.risk_score>40?"Critical":"Normal"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="global-collaboration">
        <h2>🌍 Cross-Country Care Collaboration</h2>

        <textarea
          placeholder="Share lessons learned, follow-up strategies or care challenges from your region..."
          onChange={e=>setLesson(e.target.value)}
        />

        <button onClick={()=>{
          if(lesson.trim()){
            setGlobalLessons([...globalLessons,lesson]);
            setLesson("");
          }
        }}>
          Share Knowledge
        </button>

        {globalLessons.map((l,i)=>(
          <p key={i}>🗣 {l}</p>
        ))}
      </div>

    </div>
  );
}
