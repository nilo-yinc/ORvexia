const express = require("express");
const router = express.Router();
const createWorkflow = require("../controllers/workflowController");

router.post("/", createWorkflow);

module.exports = router;
