import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-cliniq px-4 navbar-glow">
      <Link to="/" className="logo">
        <img src="/src/images/logo.png" height="35" />
      </Link>

      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#cliniqNav">
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="cliniqNav">
        <ul className="navbar-nav ms-auto gap-3">
          <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/dashboard">Dashboard</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/patient">Patient</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/insight">AI Insights</Link></li>
        </ul>
      </div>
    </nav>
  );
}
