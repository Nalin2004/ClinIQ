import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-cliniq px-4 navbar-glow">
      <Link to="/" className="logo">
        <img src="/logo.png" height="35" />
      </Link>

      <div className="collapse navbar-collapse">
        <ul className="navbar-nav ms-auto gap-3">

          <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/dashboard">Dashboard</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/patient">Patients</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/insight">AI Insights</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/followups">Follow-Ups</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/support">Support</Link></li>

        </ul>
      </div>
    </nav>
  );
}
