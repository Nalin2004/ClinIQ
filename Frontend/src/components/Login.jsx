import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const res = await api.post("/login", {
      email,
      password
    });

    localStorage.setItem("cliniq_token", res.data.token);
    localStorage.setItem("cliniq_user", res.data.name);
    localStorage.setItem("cliniq_role", res.data.role);

    if (res.data.role === "admin") {
      navigate("/dashboard");
    } else {
      navigate("/user-portal");
    }

  } catch {
    alert("Invalid credentials");
  }
};


  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleLogin}>
        <h2>Login to ClinIQ</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}
