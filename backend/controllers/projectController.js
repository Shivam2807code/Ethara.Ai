import Project from "../models/Project.js";

export const createProject = async (req, res) => {
  try {
    const { name, description, members = [] } = req.body;
    if (!name) return res.status(400).json({ message: "Project name is required" });

    const project = await Project.create({
      name,
      description,
      createdBy: req.user._id,
      members: [...new Set([...members, req.user._id.toString()])]
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProjects = async (req, res) => {
  const filter = req.user.role === "Admin" ? {} : { members: req.user._id };
  const projects = await Project.find(filter)
    .populate("members", "name email role")
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 });
  res.json(projects);
};

export const getProjectById = async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate("members", "name email role")
    .populate("createdBy", "name email");
  if (!project) return res.status(404).json({ message: "Project not found" });

  const isMember = project.members.some((m) => m._id.toString() === req.user._id.toString());
  if (req.user.role !== "Admin" && !isMember) return res.status(403).json({ message: "Access denied" });

  res.json(project);
};

export const updateProject = async (req, res) => {
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!project) return res.status(404).json({ message: "Project not found" });
  res.json(project);
};

export const deleteProject = async (req, res) => {
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) return res.status(404).json({ message: "Project not found" });
  res.json({ message: "Project deleted" });
};
