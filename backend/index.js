const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');
const auth = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'AI Job Tracker API is running!' });
});

app.use('/api/auth', authRoutes);
app.use('/api/jobs', auth, jobRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});