require('dotenv').config();
const express = require('express');
const connectDB = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Hello World',
    status: 'success'
  });
});

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

