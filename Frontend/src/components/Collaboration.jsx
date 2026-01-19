import { useEffect,useState } from "react";
import api from "../api";

export default function Collaboration(){
 const [d,setD]=useState([]);
 useEffect(()=>{api.get("/collaboration").then(r=>setD(r.data));},[]);
 return (
  <table className="cliniq-table">
   <thead><tr><th>Country</th><th>Site</th><th>Pending</th></tr></thead>
   <tbody>
    {d.map((x,i)=>(
     <tr key={i}><td>{x.country}</td><td>{x.site}</td><td>{x.pending}</td></tr>
    ))}
   </tbody>
  </table>
 );
}
