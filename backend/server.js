const express = require('express');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const errorHandler = require('./middleware/errorMiddleware');
const cors = require('cors');
require('dotenv').config();

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// 👇 Serve uploaded images statically
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/employees', employeeRoutes);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
