import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("cliniq_token");
  const role = localStorage.getItem("cliniq_role"); // "admin" or "user"

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg bg-cliniq px-4 navbar-glow">
      <Link to="/" className="navbar-brand logo">
        <img src="/src/images/logo.png" height="35" />
      </Link>

      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#cliniqNav"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="cliniqNav">
        <ul className="navbar-nav ms-auto gap-3 align-items-center">

          <li className="nav-item">
            <Link className="nav-link cliniq-link" to="/">Home</Link>
          </li>

          {token && role === "admin" && (
            <>
              <li className="nav-item"><Link className="nav-link cliniq-link" to="/dashboard">Dashboard</Link></li>
              <li className="nav-item"><Link className="nav-link cliniq-link" to="/patient">Patient</Link></li>
              <li className="nav-item"><Link className="nav-link cliniq-link" to="/insight">AI Insights</Link></li>
            </>
          )}

          {token && role === "user" && (
            <li className="nav-item">
              <Link className="nav-link cliniq-link" to="/user-portal">User Portal</Link>
            </li>
          )}

          {!token ? (
            <>
              <li className="nav-item"><Link className="btn btn-outline-info" to="/login">Login</Link></li>
              <li className="nav-item"><Link className="btn btn-info text-dark" to="/signup">Sign Up</Link></li>
            </>
          ) : (
            <li className="nav-item">
              <button className="btn btn-danger" onClick={logout}>Logout</button>
            </li>
          )}

        </ul>
      </div>
    </nav>
  );
}
