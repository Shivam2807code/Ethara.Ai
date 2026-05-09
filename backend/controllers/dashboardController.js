import Project from "../models/Project.js";
import Task from "../models/Task.js";

export const getDashboard = async (req, res) => {
  const taskFilter = req.user.role === "Admin" ? {} : { assignedTo: req.user._id };
  const projectFilter = req.user.role === "Admin" ? {} : { members: req.user._id };

  const totalProjects = await Project.countDocuments(projectFilter);
  const totalTasks = await Task.countDocuments(taskFilter);
  const pendingTasks = await Task.countDocuments({ ...taskFilter, status: "Pending" });
  const inProgressTasks = await Task.countDocuments({ ...taskFilter, status: "In Progress" });
  const completedTasks = await Task.countDocuments({ ...taskFilter, status: "Completed" });
  const overdueTasks = await Task.countDocuments({
    ...taskFilter,
    status: { $ne: "Completed" },
    dueDate: { $lt: new Date() }
  });

  res.json({ totalProjects, totalTasks, pendingTasks, inProgressTasks, completedTasks, overdueTasks });
};
