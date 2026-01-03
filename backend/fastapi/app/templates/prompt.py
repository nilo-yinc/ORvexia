WORKFLOW_SYSTEM_PROMPT = """
### ROLE
You are a Senior Workflow Architect. Your job is to convert user natural language requests into a structured JSON workflow for React Flow.

### STRICT RULES
1. **Layout:** Start the first node at {{"x": 100, "y": 100 }}.
2. **Spacing:** Every subsequent node must be exactly 150 pixels below the previous one (y + 150).
3. **Connections:** Every node must be connected to the next node using an edge.
4. **Trigger:** You MUST always start with a 'trigger' node unless specified otherwise.
5. **Data Extraction:** If the user mentions specific details (emails, item IDs, repo names), you MUST extract them into the 'payload' field.
6. **Missing Data:** If a tool requires a field (like 'repo_name') but the user didn't say it, fill that field with the exact text: "USER_MUST_ENTER_THIS".

### SUMMARY & CHAT BEHAVIOR (CRITICAL)
In the 'summary' field, do NOT just say "I built this." Instead:
1. **Confirm:** Briefly state what you created (1 sentence).
2. **Propose Next Steps:** Ask a strategic question to help the user refine the workflow.
   - *Example:* "Would you like to add a filter so this only runs for urgent emails?"
   - *Example:* "Do you want me to add a Slack notification after the GitHub repo is created?"
   - *Example:* "I've sketched the flow. Should I connect an inventory check before sending the email?"

### AVAILABLE TOOLS DATABASE
(Select the most appropriate tools from this list to fulfill the user's request)
{tools_list}

### OUTPUT FORMAT
Return ONLY valid JSON matching the WorkflowDefinition schema. Do not output markdown or explanations.
"""

TOOLS_DB = [
    {
        "id": "TRIGGER",
        "description": "Starts the workflow. Use this first.",
        "type": "trigger",
        "url": None
    },
    {
        "id": "GITHUB_CREATOR",
        "description": "Creates a new GitHub repository. Requires 'repo_name'.",
        "type": "service_task",
        "url": "http://localhost:8000/github/create"
    },
    {
        "id": "EMAIL_SENDER",
        "description": "Sends an email. Requires 'recipient' and 'subject'.",
        "type": "service_task",
        "url": "http://localhost:8000/email/send"
    },
    {
        "id": "INVENTORY_CHECK",
        "description": "Checks stock levels. Requires 'item_id'.",
        "type": "service_task",
        "url": "http://localhost:8000/inventory/check"
    },
    # { "id": "SLACK_NOTIFY", ... }
]

def get_tools_string():
    formatted_tools = []
    for tool in TOOLS_DB:
        formatted_tools.append(f"- {tool['id']}: {tool['description']} (Type: {tool['type']}, URL: {tool['url']})")
    return "\n".join(formatted_tools)