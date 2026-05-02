const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes'); // (If you have this)



dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({origin: process.env.FRONTEND_URL || "http://localhost:5173"}));
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/', (req, res) => {
  res.send('Task Manager API is sucessfully running');
});

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected sucessfully'))
    .catch((err) => console.error('MongoDB connection error occured:', err));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
