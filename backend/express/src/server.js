const express = require("express");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, '../../.env') });
require("./config/mongoose-connection");
const workflowRouter = require("./routes/workflowRoutes");
const webhookRoutes = require("./routes/webhookRoutes");
const appsRouter = require("./routes/apps.routes");
const userRoutes = require("./routes/user.routes");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: "GET, POST, PUT, DELETE",
  })
);
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Express Server Running');
});

app.use('/api/workflows',workflowRouter);
app.use('/api/webhook', webhookRoutes);
app.use('/api/apps', appsRouter);

// console.log('Apps Router Loaded', appsRouter);
const port = process.env.PORT || 3000;
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/v1/users", userRoutes);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
