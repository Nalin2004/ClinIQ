export const saveToken = (t) => localStorage.setItem("token", t)
export const getToken = () => localStorage.getItem("token")
export const logout = () => localStorage.clear()

api.interceptors.request.use((config)=>{
  const token = localStorage.getItem("token")
  if(token) config.headers.Authorization = `Bearer ${token}`
  return config
})

import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}
