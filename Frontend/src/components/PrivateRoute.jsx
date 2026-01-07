import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children, adminOnly = false }) {
  const token = localStorage.getItem("cliniq_token");
  const role = localStorage.getItem("cliniq_role");

  if (!token) return <Navigate to="/login" />;

  if (adminOnly && role !== "admin") return <Navigate to="/user-portal" />;

  return children;
}
