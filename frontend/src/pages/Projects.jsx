import React, { useEffect, useState } from "react";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Projects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", members: [] });
  const [error, setError] = useState("");

  const loadProjects = async () => {
    try {
      const { data } = await api.get("/projects");
      setProjects(data);
    } catch (err) {
      setError(err.response?.data?.message || "Projects load failed");
    }
  };

  useEffect(() => {
    loadProjects();
    if (user?.role === "Admin") {
      api.get("/auth/users").then((res) => setUsers(res.data)).catch(() => {});
    }
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleMemberChange = (e) => {
    const selected = Array.from(e.target.selectedOptions).map((option) => option.value);
    setForm({ ...form, members: selected });
  };

  const createProject = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/projects", form);
      setForm({ name: "", description: "", members: [] });
      loadProjects();
    } catch (err) {
      setError(err.response?.data?.message || "Project create failed");
    }
  };

  const deleteProject = async (id) => {
    if (!confirm("Delete this project?")) return;
    await api.delete(`/projects/${id}`);
    loadProjects();
  };

  return (
    <section>
      <h1>Projects</h1>
      {error && <p className="error">{error}</p>}

      {user?.role === "Admin" && (
        <form className="panel" onSubmit={createProject}>
          <h2>Create Project</h2>
          <input name="name" placeholder="Project name" value={form.name} onChange={handleChange} required />
          <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />
          <label>Select team members</label>
          <select multiple value={form.members} onChange={handleMemberChange}>
            {users.map((u) => (
              <option key={u._id} value={u._id}>{u.name} - {u.role}</option>
            ))}
          </select>
          <button>Create Project</button>
        </form>
      )}

      <div className="list">
        {projects.map((project) => (
          <div className="card" key={project._id}>
            <div className="row-between">
              <h3>{project.name}</h3>
              {user?.role === "Admin" && <button className="danger" onClick={() => deleteProject(project._id)}>Delete</button>}
            </div>
            <p>{project.description || "No description"}</p>
            <p><b>Created by:</b> {project.createdBy?.name || "Admin"}</p>
            <p><b>Members:</b> {project.members?.map((m) => m.name).join(", ") || "No members"}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
