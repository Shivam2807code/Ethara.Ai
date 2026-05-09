import Task from "../models/Task.js";

export const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, project, assignedTo } = req.body;
    if (!title || !dueDate || !project || !assignedTo) {
      return res.status(400).json({ message: "Title, dueDate, project and assignedTo are required" });
    }

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      project,
      assignedTo,
      createdBy: req.user._id
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTasks = async (req, res) => {
  const filter = req.user.role === "Admin" ? {} : { assignedTo: req.user._id };
  const tasks = await Task.find(filter)
    .populate("project", "name")
    .populate("assignedTo", "name email role")
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 });
  res.json(tasks);
};

export const updateTask = async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found" });

  if (req.user.role !== "Admin" && task.assignedTo.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Access denied" });
  }

  if (req.user.role === "Member") {
    task.status = req.body.status || task.status;
  } else {
    Object.assign(task, req.body);
  }

  const updated = await task.save();
  res.json(updated);
};

export const deleteTask = async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found" });
  res.json({ message: "Task deleted" });
};
