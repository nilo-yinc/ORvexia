const express = require("express");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config({ path: path.join(__dirname, '../../.env') });
require("./config/mongoose-connection");
const workflowRouter = require("./routes/workflowRoutes");
const webhookRoutes = require("./routes/webhookRoutes");
const appsRouter = require("./routes/apps.routes");
const userRoutes = require("./routes/user.routes");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Frontend URL
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173", // Explicitly set for Socket.io/Express compatibility
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: "GET, POST, PUT, DELETE",
  })
);
app.use(cookieParser());

// Make io accessible to our routers
app.use((req, res, next) => {
  req.io = io;
  next();
});

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


server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
