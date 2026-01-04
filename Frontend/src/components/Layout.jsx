import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Navbar />
      <div className="p-6">{children}</div>
    </div>
  );
}
