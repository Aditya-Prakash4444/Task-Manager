const express = require('express');
const { signup, login, getAllUsers, getTeamMembers } = require('../controllers/authController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/users', verifyToken, verifyAdmin, getAllUsers);
router.get('/team-members', verifyToken, getTeamMembers);
module.exports = router;