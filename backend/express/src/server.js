require('dotenv').config();
const express = require('express');
require('./config/mongoose-connection');
const logger = require('./middlewares/logger');
const workflowRouter = require('./routes/workflowRoutes');
const appsRouter = require('./routes/apps.routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(logger);

app.get('/', (req, res) => {
  res.send('Express Server Running');
});

app.use('/api/workflows',workflowRouter);
app.use('/api/apps', appsRouter);

// console.log('Apps Router Loaded', appsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
