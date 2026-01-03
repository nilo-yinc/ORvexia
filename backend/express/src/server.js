require('dotenv').config({ path: '../../.env' });
const express = require('express');
const connectDB = require('./config/mongoose-connection');
const demoRoutes = require('./routes/demoRoutes');
const logger = require('./middlewares/logger');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Connect to Database
connectDB();

app.use(express.json());
app.use(logger);

app.use('/api/v1/demo', demoRoutes);

app.get('/', (req, res) => {
  res.send('Express Server Running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
