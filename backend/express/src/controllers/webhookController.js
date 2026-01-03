const Workflow = require('../models/workflow-model');
const WorkflowVersion = require('../models/workflowVersion-model');
const Execution = require('../models/execution-model');
const { runWorkflow } = require('../engine/engine'); // We will write this next

const webhook = async (req, res) => {
    try {
        const { slug } = req.params;
        const inputData = req.body; // e.g., { "order_id": 123 }

        const workflow = await Workflow.findOne({ triggerSlug: slug });
        console.log("Webhook triggered for workflow:", workflow);
        if (!workflow || !workflow.active_version_id) {
            return res.status(404).json({ error: "Workflow not active" });
        }

        const activeVersion = await WorkflowVersion.findById(workflow.active_version_id);
        if (!activeVersion) {
            return res.status(500).json({ error: "Version definition missing" });
        }

        const execution = await Execution.create({
            workflow_id: workflow._id,
            version_id: activeVersion._id,
            status: 'RUNNING',
            contextData: inputData,
            steps: []
        });

        runWorkflow(activeVersion.definition.nodes, activeVersion.definition.edges, execution, req.io);

        res.json({ status: "started", executionId: execution._id });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export default webhook;