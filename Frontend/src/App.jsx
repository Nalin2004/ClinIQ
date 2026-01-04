import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import Patient from "./components/Patient";
import Insight from "./components/Insight";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/patient" element={<Patient />} />
        <Route path="/insight" element={<Insight />} />
      </Routes>
    </Layout>
  );
}
