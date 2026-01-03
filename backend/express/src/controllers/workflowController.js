const Workflow = require("../models/workflow-model");
const WorkflowVersion = require("../models/workflowVersion-model");

// 1. Create/Update a Workflow (The "Save" Button)
const createOrUpdateWorkflow = async (req, res) => {
  try {
    const { name, owner_id, triggerSlug, nodes, edges } = req.body;

    // A. Find or Create the "Container" (Workflow)
    let workflow = await Workflow.findOne({ triggerSlug });

    if (!workflow) {
      workflow = await Workflow.create({
        name,
        owner_id,
        triggerSlug,
      });
    }

    // B. Increment Version (Count + 1)
    const count = await WorkflowVersion.countDocuments({
      workflow_id: workflow._id,
    });
    const newVersion = `1.0.${count + 1}`;

    // C. Save the Logic (The "Brain")
    const versionDoc = await WorkflowVersion.create({
      workflow_id: workflow._id,
      version: newVersion,
      definition: { nodes, edges },
    });

    // D. Update the Pointer (Make it Live!)
    workflow.active_version_id = versionDoc._id;
    workflow.is_active = true;
    await workflow.save();

    res.json({ success: true, workflowId: workflow._id, version: newVersion });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = createOrUpdateWorkflow;