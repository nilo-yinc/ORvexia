require('dotenv').config();
const express = require('express');
require('./config/mongoose-connection');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());

app.get('/', (req, res) => {
  res.send('Express Server Running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
