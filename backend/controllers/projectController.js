const Project = require('../models/Project');

exports.createProject = async(req,res) => {
    try{
        const { name, description, members } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'Project name is required.' });
        }
        const newProject = new Project({
            name,
            description,
            members,
            createdBy: req.user.id
        });
        const savedProject = await newProject.save();
        const populatedProject = await savedProject.populate('createdBy', 'name email').populate('members', 'name email');
        res.status(201).json(populatedProject);
    }
    catch(error){
        res.status(500).json({message: 'Failed to create project', error: error.message});
    }
};

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate('createdBy', 'name email')
      .populate('members', 'name email');
      
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch projects', error: error.message });
  }
};

exports.addTeamMember = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { userId } = req.body; 

    const project = await Project.findById(projectId);
    
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    if (project.members.includes(userId)) {
      return res.status(400).json({ message: "User is already on this team" });
    }

    project.members.push(userId);
    await project.save();
    const updatedProject = await project.populate('members', 'name email');

    res.status(200).json({ message: "Team member added successfully", project: updatedProject });
  } catch (error) {
    res.status(500).json({ message: "Failed to add team member", error: error.message });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const project = await Project.findById(projectId)
      .populate('createdBy', 'name email')
      .populate('members', 'name email');
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }
    
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch project', error: error.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }
    
    if (project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the project creator can delete this project.' });
    }
    
    await Project.findByIdAndDelete(projectId);
    
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete project', error: error.message });
  }
};