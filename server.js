require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const connectDB = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
  res.json({
    message: 'Hello World',
    status: 'success',
    docs: 'http://localhost:' + PORT + '/api-docs'
  });
});

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});

