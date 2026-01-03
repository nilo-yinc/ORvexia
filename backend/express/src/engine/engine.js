const axios = require('axios');

const runWorkflow = async (nodes, edges, execution, socket) => {
    let currentData = execution.contextData;
    
    // Simple Traversal: Find Start -> Find Next
    // Note: For MVP, we assume a simple linear chain based on edges
    let currentNode = nodes.find(n => n.type === 'trigger');

    while (currentNode) {
        try {
            // 1. Log Step: Started
            execution.steps.push({
                nodeId: currentNode.id,
                label: currentNode.data.label,
                status: 'RUNNING',
                startedAt: new Date()
            });
            await execution.save(); // Save to DB so frontend sees "Yellow"

            // 2. Execute Task (Call FastAPI)
            if (currentNode.type === 'service_task') {
                const response = await axios.post(currentNode.data.serviceUrl, currentData);
                
                // Update "The Bag" (Context)
                currentData = { ...currentData, ...response.data };
                
                // Update the Step in DB with Output
                const stepIndex = execution.steps.findIndex(s => s.nodeId === currentNode.id);
                execution.steps[stepIndex].status = 'SUCCESS';
                execution.steps[stepIndex].output = response.data;
                execution.steps[stepIndex].completedAt = new Date();
                
                // Update Global Context in DB
                execution.contextData = currentData;
            }

            // 3. Socket Update (Visuals)
            socket.emit('workflow_update', { 
                executionId: execution._id, 
                nodeId: currentNode.id, 
                status: 'SUCCESS' 
            });

            await execution.save(); // Save "Green" status

            // 4. Find Next Node
            const edge = edges.find(e => e.source === currentNode.id);
            if (!edge) break;
            currentNode = nodes.find(n => n.id === edge.target);

        } catch (error) {
            // Handle Failure
            const stepIndex = execution.steps.findIndex(s => s.nodeId === currentNode.id);
            if(stepIndex > -1) {
                execution.steps[stepIndex].status = 'FAILED';
                execution.steps[stepIndex].error = error.message;
            }
            execution.status = 'FAILED';
            await execution.save();
            socket.emit('workflow_update', { nodeId: currentNode.id, status: 'FAILED' });
            return; // Stop engine
        }
    }

    execution.status = 'COMPLETED';
    await execution.save();
}

module.exports = { runWorkflow };