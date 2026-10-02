const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');
const citizenRoutes = require('./routes/citizen');

app.use('/api/auth', authRoutes);
app.use('/api/citizen', citizenRoutes);

app.get('/', (req, res) => {
  res.send('CivicAdv Backend Running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const complaintRoutes = require('./routes/complaints');
app.use('/api/complaints', complaintRoutes);

const pollRoutes = require('./routes/polls');
app.use('/api/polls', pollRoutes);