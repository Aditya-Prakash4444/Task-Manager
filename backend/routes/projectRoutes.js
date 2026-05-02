const express = require('express');
const router = express.Router();
const { createProject, getProjects, addTeamMember, getProjectById, deleteProject } = require('../controllers/projectController');

const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

router.post('/', verifyToken, verifyAdmin, createProject);
router.get('/', verifyToken, getProjects);
router.get('/:projectId', verifyToken, getProjectById);
router.delete('/:projectId', verifyToken, verifyAdmin, deleteProject);

router.post('/:projectId/members', verifyToken, verifyAdmin, addTeamMember);

module.exports = router;