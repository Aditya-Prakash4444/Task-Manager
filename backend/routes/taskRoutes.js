const express = require('express');
const { createTask, getTasks, updateTaskStatus, deleteTask } = require('../controllers/taskController.js');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware.js');

const router = express.Router();
router.get('/', verifyToken, getTasks);
router.post('/', verifyToken, verifyAdmin ,createTask);
router.patch('/:id/status', verifyToken, updateTaskStatus);
router.delete('/:id', verifyToken, verifyAdmin, deleteTask);

module.exports = router;