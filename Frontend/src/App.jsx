import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import Patient from "./components/Patient";
import Insight from "./components/Insight";
import Login from "./components/Login";
import Signup from "./components/Signup";
import PrivateRoute from "./components/PrivateRoute";
import UserPortal from "./components/UserPortal";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* USER PORTAL */}
        <Route
          path="/user-portal"
          element={
            <PrivateRoute>
              <UserPortal />
            </PrivateRoute>
          }
        />

        {/* ADMIN ONLY ROUTES */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute adminOnly={true}>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/patient"
          element={
            <PrivateRoute adminOnly={true}>
              <Patient />
            </PrivateRoute>
          }
        />

        <Route
          path="/insight"
          element={
            <PrivateRoute adminOnly={true}>
              <Insight />
            </PrivateRoute>
          }
        />
      </Routes>
    </Layout>
  );
}
