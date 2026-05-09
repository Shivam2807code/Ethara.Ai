import React from "react";
import { Link, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Projects from "./pages/Projects.jsx";
import Tasks from "./pages/Tasks.jsx";

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="brand">Team Task Manager</Link>
        {user && (
          <div className="nav-links">
            <Link to="/">Dashboard</Link>
            <Link to="/projects">Projects</Link>
            <Link to="/tasks">Tasks</Link>
            <span>{user.name} ({user.role})</span>
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </nav>
      <main className="container">
        <Routes>
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/projects" element={<PrivateRoute><Projects /></PrivateRoute>} />
          <Route path="/tasks" element={<PrivateRoute><Tasks /></PrivateRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </main>
    </>
  );
}

export default function App() {
  return <Layout />;
}
