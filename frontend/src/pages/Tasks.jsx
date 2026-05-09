import React, { useEffect, useState } from "react";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Tasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "Pending",
    priority: "Medium",
    dueDate: "",
    project: "",
    assignedTo: "",
  });

  const loadTasks = async () => {
    try {
      const { data } = await api.get("/tasks");
      setTasks(data);
    } catch (err) {
      setError(err.response?.data?.message || "Tasks load failed");
    }
  };

  useEffect(() => {
    loadTasks();
    api.get("/projects").then((res) => setProjects(res.data)).catch(() => {});
    if (user?.role === "Admin") {
      api.get("/auth/users").then((res) => setUsers(res.data)).catch(() => {});
    }
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const createTask = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/tasks", form);
      setForm({ title: "", description: "", status: "Pending", priority: "Medium", dueDate: "", project: "", assignedTo: "" });
      loadTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Task create failed");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/tasks/${id}`, { status });
      loadTasks();
    } catch (err) {
      alert(err.response?.data?.message || "Status update failed");
    }
  };

  const deleteTask = async (id) => {
    if (!confirm("Delete this task?")) return;
    await api.delete(`/tasks/${id}`);
    loadTasks();
  };

  return (
    <section>
      <h1>Tasks</h1>
      {error && <p className="error">{error}</p>}

      {user?.role === "Admin" && (
        <form className="panel" onSubmit={createTask}>
          <h2>Create Task</h2>
          <input name="title" placeholder="Task title" value={form.title} onChange={handleChange} required />
          <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />
          <div className="form-grid">
            <select name="project" value={form.project} onChange={handleChange} required>
              <option value="">Select project</option>
              {projects.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
            </select>
            <select name="assignedTo" value={form.assignedTo} onChange={handleChange} required>
              <option value="">Assign to</option>
              {users.map((u) => <option key={u._id} value={u._id}>{u.name} - {u.role}</option>)}
            </select>
            <select name="priority" value={form.priority} onChange={handleChange}>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
            <input name="dueDate" type="date" value={form.dueDate} onChange={handleChange} required />
          </div>
          <button>Create Task</button>
        </form>
      )}

      <div className="list">
        {tasks.map((task) => (
          <div className="card" key={task._id}>
            <div className="row-between">
              <h3>{task.title}</h3>
              {user?.role === "Admin" && <button className="danger" onClick={() => deleteTask(task._id)}>Delete</button>}
            </div>
            <p>{task.description || "No description"}</p>
            <p><b>Project:</b> {task.project?.name}</p>
            <p><b>Assigned to:</b> {task.assignedTo?.name}</p>
            <p><b>Priority:</b> {task.priority}</p>
            <p><b>Due:</b> {new Date(task.dueDate).toLocaleDateString()}</p>
            <label>Status</label>
            <select value={task.status} onChange={(e) => updateStatus(task._id, e.target.value)}>
              <option>Pending</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
          </div>
        ))}
      </div>
    </section>
  );
}
