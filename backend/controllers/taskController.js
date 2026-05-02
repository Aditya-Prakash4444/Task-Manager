const Task = require('../models/Task');
const Project = require('../models/Project');

exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate, assignedTo, projectId } = req.body;

    if (!title || !projectId) {
      return res.status(400).json({ message: 'Title and Project ID are required.' });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    const newTask = new Task({
      title,
      description,
      dueDate,
      assignedTo,
      projectId
    });

    const savedTask = await newTask.save();
    const populatedTask = await savedTask.populate('assignedTo', 'name email').populate('projectId', 'name');
    res.status(201).json(populatedTask);
  } 
  catch (error) {
    res.status(500).json({ message: 'Failed to create task', error: error.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const filter = {};
    if (req.query.projectId) {
      filter.projectId = req.query.projectId;
    }

    const tasks = await Task.find(filter)
      .populate('assignedTo', 'name email')
      .populate('projectId', 'name');
      
    res.status(200).json(tasks);
  } 
  catch (error) {
    res.status(500).json({ message: 'Failed to fetch tasks', error: error.message });
  }
};

exports.updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const taskId = req.params.id; 

    if (!['Pending', 'In Progress', 'Completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      taskId, 
      { status }, 
      { new: true } 
    ).populate('assignedTo', 'name email').populate('projectId', 'name');

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    res.status(200).json(updatedTask);
  }
  catch (error) {
    res.status(500).json({ message: 'Failed to update task', error: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;

    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    res.status(200).json({ message: 'Task deleted successfully', task: deletedTask });
  }
  catch (error) {
    res.status(500).json({ message: 'Failed to delete task', error: error.message });
  }
};