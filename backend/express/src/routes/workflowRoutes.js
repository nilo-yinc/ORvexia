const express = require("express");
const router = express.Router();
const createOrUpdateWorkflow = require("../controllers/workflowController");

router.post("/", createOrUpdateWorkflow);

module.exports = router;
