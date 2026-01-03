import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Save,
  Download,
  Upload,
  Zap,
  Database,
  Mail,
  Globe,
  FileText,
  ArrowLeft,
  Settings as SettingsIcon,
  Undo2,
  Redo2,
  Search,
  Plus,
  X,
  GitBranch,
  Clock,
  Code,
  Filter,
  Trash2,
  Copy,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

const nodeTypes = [
  { type: 'trigger', label: 'Trigger', icon: Zap, color: '#f97316', description: 'Start your workflow' },
  { type: 'action', label: 'Action', icon: Play, color: '#3b82f6', description: 'Do something' },
  { type: 'condition', label: 'Condition', icon: GitBranch, color: '#8b5cf6', description: 'Branch your flow' },
  { type: 'delay', label: 'Delay', icon: Clock, color: '#06b6d4', description: 'Wait before continuing' },
  { type: 'code', label: 'Code', icon: Code, color: '#10b981', description: 'Run custom code' },
  { type: 'filter', label: 'Filter', icon: Filter, color: '#eab308', description: 'Filter data' },
];

const appCategories = [
  { id: 'home', label: 'Home', icon: Zap },
  { id: 'apps', label: 'Apps', icon: Globe },
  { id: 'ai', label: 'AI', icon: Zap },
  { id: 'flow-controls', label: 'Flow controls', icon: Filter },
  { id: 'utilities', label: 'Utilities', icon: SettingsIcon },
  { id: 'custom', label: 'Custom', icon: Code },
];

const popularApps = [
  { name: 'Microsoft Excel', icon: '📊', category: 'apps', triggers: ['New Row', 'Updated Row'], actions: ['Add Row', 'Update Row', 'Find Row'] },
  { name: 'Google Drive', icon: '📁', category: 'apps', triggers: ['New File', 'New Folder'], actions: ['Upload File', 'Create Folder', 'Move File'] },
  { name: 'Gmail', icon: '✉️', category: 'apps', triggers: ['New Email', 'New Labeled Email'], actions: ['Send Email', 'Create Draft', 'Add Label'] },
  { name: 'Notion', icon: '📝', category: 'apps', triggers: ['New Database Item', 'Updated Page'], actions: ['Create Page', 'Update Database Item'] },
  { name: 'Telegram', icon: '✈️', category: 'apps', triggers: ['New Message', 'New Channel Post'], actions: ['Send Message', 'Send Photo'] },
  { name: 'Google Calendar', icon: '📅', category: 'apps', triggers: ['Event Start', 'New Event'], actions: ['Create Event', 'Update Event'] },
  { name: 'Google Sheets', icon: '📈', category: 'apps', triggers: ['New Row', 'Updated Row'], actions: ['Create Row', 'Update Row', 'Clear Row'] },
  { name: 'Slack', icon: '💬', category: 'apps', triggers: ['New Message', 'New Reaction'], actions: ['Send Message', 'Send Direct Message'] },
  { name: 'HubSpot', icon: '🔶', category: 'apps', triggers: ['New Contact', 'Updated Deal'], actions: ['Create Contact', 'Update Contact'] },
  { name: 'Google Forms', icon: '📋', category: 'apps', triggers: ['New Response'], actions: ['Create Form'] },
  { name: 'Facebook Lead Ads', icon: '👥', category: 'apps', triggers: ['New Lead'], actions: [] },
  { name: 'Mailchimp', icon: '🐵', category: 'apps', triggers: ['New Subscriber', 'Unsubscribe'], actions: ['Add Subscriber', 'Update Subscriber'] },
  { name: 'Microsoft Outlook', icon: '📧', category: 'apps', triggers: ['New Email'], actions: ['Send Email', 'Create Event'] },
  { name: 'Trello', icon: '📋', category: 'apps', triggers: ['New Card', 'Card Moved'], actions: ['Create Card', 'Update Card', 'Move Card'] },
  { name: 'Stripe', icon: '💳', category: 'apps', triggers: ['New Payment', 'Failed Payment'], actions: ['Create Customer', 'Create Invoice'] },
  { name: 'Twitter', icon: '🐦', category: 'apps', triggers: ['New Tweet', 'New Mention'], actions: ['Post Tweet', 'Like Tweet'] },
];

const builtInTools = [
  { name: 'Webhooks', icon: '🪝', category: 'home', triggers: ['Catch Hook'], actions: ['POST Request', 'GET Request'] },
  { name: 'Schedule', icon: '⏰', category: 'home', triggers: ['Every Hour', 'Every Day', 'Custom'], actions: [] },
  { name: 'Email', icon: '📨', category: 'home', triggers: ['New Email'], actions: ['Send Email'] },
  { name: 'RSS', icon: '📡', category: 'home', triggers: ['New Item in Feed'], actions: [] },
  { name: 'Code', icon: '💻', category: 'home', triggers: [], actions: ['Run JavaScript', 'Run Python'] },
  { name: 'Email Parser', icon: '📬', category: 'home', triggers: ['New Email'], actions: ['Parse Email'] },
  { name: 'Storage', icon: '💾', category: 'home', triggers: [], actions: ['Store Value', 'Get Value'] },
  { name: 'Formatter', icon: '✨', category: 'utilities', triggers: [], actions: ['Format Text', 'Format Date', 'Format Number'] },
  { name: 'Filter', icon: '🔍', category: 'flow-controls', triggers: [], actions: ['Continue If', 'Stop If'] },
  { name: 'Paths', icon: '🔀', category: 'flow-controls', triggers: [], actions: ['Split Path'] },
  { name: 'Delay', icon: '⏱️', category: 'flow-controls', triggers: [], actions: ['Delay For', 'Delay Until'] },
];

const workflowTemplates = [
  {
    name: 'Gmail to Google Sheets',
    description: 'Save new Gmail emails to Google Sheets',
    trigger: { app: 'Gmail', event: 'New Email' },
    actions: [{ app: 'Google Sheets', event: 'Create Row' }],
  },
  {
    name: 'Slack Notifications',
    description: 'Send Slack message when form is submitted',
    trigger: { app: 'Google Forms', event: 'New Response' },
    actions: [{ app: 'Slack', event: 'Send Message' }],
  },
  {
    name: 'Contact Sync',
    description: 'Add new HubSpot contacts to Mailchimp',
    trigger: { app: 'HubSpot', event: 'New Contact' },
    actions: [{ app: 'Mailchimp', event: 'Add Subscriber' }],
  },
];

const initialNodes = [
  {
    id: 'start',
    type: 'input',
    data: { label: '⚡ Start Workflow', nodeType: 'start' },
    position: { x: 250, y: 50 },
    style: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      padding: '16px 24px',
      fontWeight: '600',
      fontSize: '14px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    },
  },
];

const initialEdges = [];

export const WorkflowBuilder = () => {
  const navigate = useNavigate();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState(null);
  const [workflowName, setWorkflowName] = useState('Untitled Workflow');
  const [showAppSelector, setShowAppSelector] = useState(false);
  const [showEventSelector, setShowEventSelector] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [history, setHistory] = useState([{ nodes: initialNodes, edges: initialEdges }]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [draggedNode, setDraggedNode] = useState(null);
  const [currentNodeForApp, setCurrentNodeForApp] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);
  const [nodeIdCounter, setNodeIdCounter] = useState(1);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, history]);

  const onConnect = useCallback(
    (params) => {
      const newEdges = addEdge({
        ...params,
        animated: true,
        type: 'smoothstep',
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          color: '#9ca3af',
        },
        style: {
          strokeWidth: 2,
          stroke: '#9ca3af',
        },
      }, edges);
      setEdges(newEdges);
      saveHistory(nodes, newEdges);
    },
    [edges, nodes]
  );

  const saveHistory = (newNodes, newEdges) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ nodes: newNodes, edges: newEdges });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setNodes(history[newIndex].nodes);
      setEdges(history[newIndex].edges);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setNodes(history[newIndex].nodes);
      setEdges(history[newIndex].edges);
    }
  };

  const onDragStart = (event, nodeType) => {
    setDraggedNode(nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const onDrop = (event) => {
    event.preventDefault();
    if (!draggedNode) return;

    const reactFlowBounds = event.target.getBoundingClientRect();
    const position = {
      x: event.clientX - reactFlowBounds.left - 100,
      y: event.clientY - reactFlowBounds.top - 25,
    };

    const newNode = {
      id: `node_${nodeIdCounter}`,
      type: 'default',
      data: {
        label: `${draggedNode.label}`,
        nodeType: draggedNode.type,
        icon: draggedNode.icon,
        needsConfiguration: true,
      },
      position,
      style: {
        background: draggedNode.color,
        color: 'white',
        border: 'none',
        borderRadius: '10px',
        padding: '12px 20px',
        fontWeight: '500',
        fontSize: '13px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        cursor: 'pointer',
      },
    };

    setNodeIdCounter(nodeIdCounter + 1);
    const newNodes = [...nodes, newNode];
    setNodes(newNodes);
    saveHistory(newNodes, edges);
    setDraggedNode(null);

    if (draggedNode.type === 'trigger' || draggedNode.type === 'action') {
      setCurrentNodeForApp(newNode.id);
      setShowAppSelector(true);
    }
  };

  const onNodeClick = (event, node) => {
    setSelectedNode(node);

    if ((node.data.nodeType === 'trigger' || node.data.nodeType === 'action') && node.data.needsConfiguration) {
      setCurrentNodeForApp(node.id);
      setShowAppSelector(true);
    }
  };

  const addNodeFromApp = (app) => {
    setSelectedApp(app);
    setShowAppSelector(false);
    setShowEventSelector(true);
  };

  const selectEventForNode = (event) => {
    if (!currentNodeForApp || !selectedApp) return;

    const updatedNodes = nodes.map(node => {
      if (node.id === currentNodeForApp) {
        return {
          ...node,
          data: {
            ...node.data,
            label: `${selectedApp.icon} ${selectedApp.name}: ${event}`,
            app: selectedApp.name,
            event: event,
            needsConfiguration: false,
          },
        };
      }
      return node;
    });

    setNodes(updatedNodes);
    saveHistory(updatedNodes, edges);
    setShowEventSelector(false);
    setCurrentNodeForApp(null);
    setSelectedApp(null);
  };

  const deleteNode = (nodeId) => {
    const newNodes = nodes.filter(n => n.id !== nodeId);
    const newEdges = edges.filter(e => e.source !== nodeId && e.target !== nodeId);
    setNodes(newNodes);
    setEdges(newEdges);
    saveHistory(newNodes, newEdges);
    setSelectedNode(null);
  };

  const duplicateNode = (node) => {
    const newNode = {
      ...node,
      id: `node_${nodeIdCounter}`,
      position: {
        x: node.position.x + 50,
        y: node.position.y + 50,
      },
    };
    setNodeIdCounter(nodeIdCounter + 1);
    const newNodes = [...nodes, newNode];
    setNodes(newNodes);
    saveHistory(newNodes, edges);
  };

  const saveWorkflow = () => {
    const workflow = {
      name: workflowName,
      nodes,
      edges,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(`workflow_${Date.now()}`, JSON.stringify(workflow));
    alert('Workflow saved successfully!');
  };

  const exportWorkflow = () => {
    const workflow = {
      name: workflowName,
      nodes,
      edges,
      version: '1.0',
    };
    const blob = new Blob([JSON.stringify(workflow, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${workflowName.replace(/\s+/g, '_')}.json`;
    a.click();
  };

  const importWorkflow = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const workflow = JSON.parse(e.target.result);
        setWorkflowName(workflow.name || 'Imported Workflow');
        setNodes(workflow.nodes || []);
        setEdges(workflow.edges || []);
        saveHistory(workflow.nodes || [], workflow.edges || []);
      } catch (error) {
        alert('Failed to import workflow. Invalid file format.');
      }
    };
    reader.readAsText(file);
  };

  const loadTemplate = (template) => {
    const triggerNode = {
      id: 'trigger_1',
      type: 'default',
      data: {
        label: `${template.trigger.app}: ${template.trigger.event}`,
        nodeType: 'trigger',
        app: template.trigger.app,
        event: template.trigger.event,
      },
      position: { x: 250, y: 150 },
      style: {
        background: '#f97316',
        color: 'white',
        border: 'none',
        borderRadius: '10px',
        padding: '12px 20px',
        fontWeight: '500',
        fontSize: '13px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      },
    };

    const actionNodes = template.actions.map((action, idx) => ({
      id: `action_${idx + 1}`,
      type: 'default',
      data: {
        label: `${action.app}: ${action.event}`,
        nodeType: 'action',
        app: action.app,
        event: action.event,
      },
      position: { x: 250, y: 250 + (idx * 100) },
      style: {
        background: '#3b82f6',
        color: 'white',
        border: 'none',
        borderRadius: '10px',
        padding: '12px 20px',
        fontWeight: '500',
        fontSize: '13px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      },
    }));

    const newNodes = [initialNodes[0], triggerNode, ...actionNodes];

    const newEdges = [
      {
        id: 'e_start_trigger',
        source: 'start',
        target: 'trigger_1',
        animated: true,
        type: 'smoothstep',
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      ...actionNodes.map((node, idx) => ({
        id: `e_${idx === 0 ? 'trigger' : `action_${idx}`}_${node.id}`,
        source: idx === 0 ? 'trigger_1' : `action_${idx}`,
        target: node.id,
        animated: true,
        type: 'smoothstep',
        markerEnd: { type: MarkerType.ArrowClosed },
      })),
    ];

    setNodes(newNodes);
    setEdges(newEdges);
    setWorkflowName(template.name);
    saveHistory(newNodes, newEdges);
    setShowTemplates(false);
  };

  const filteredApps = [...popularApps, ...builtInTools].filter(app => {
    const matchesSearch = searchQuery === '' || app.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'home' ? app.category === 'home' :
                           selectedCategory === 'apps' ? app.category === 'apps' :
                           selectedCategory === 'utilities' ? app.category === 'utilities' :
                           selectedCategory === 'flow-controls' ? app.category === 'flow-controls' :
                           true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black p-6">
      <div className="h-[calc(100vh-3rem)] flex gap-6">
        {/* Left Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-72 flex-shrink-0 space-y-4"
        >
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm">
            <button
              onClick={() => navigate('/workflows')}
              className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-3 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Workflows
            </button>
            <input
              type="text"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
              placeholder="Workflow name..."
            />
          </div>

          {/* Node Palette - Draggable */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-orange-500" />
              Drag to Canvas
            </h3>
            <div className="space-y-2">
              {nodeTypes.map((nodeType) => (
                <div
                  key={nodeType.type}
                  draggable
                  onDragStart={(e) => onDragStart(e, nodeType)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition cursor-move border border-transparent hover:border-orange-300 dark:hover:border-orange-700 group"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center transition group-hover:scale-110"
                    style={{ backgroundColor: nodeType.color }}
                  >
                    <nodeType.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {nodeType.label}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{nodeType.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <button
                onClick={saveWorkflow}
                className="w-full flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-900 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-950 transition"
              >
                <Save className="w-4 h-4" />
                Save Workflow
              </button>
              <button
                onClick={exportWorkflow}
                className="w-full flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-900 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-950 transition"
              >
                <Download className="w-4 h-4" />
                Export JSON
              </button>
              <label className="w-full flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-900 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-950 transition cursor-pointer">
                <Upload className="w-4 h-4" />
                Import JSON
                <input
                  type="file"
                  accept=".json"
                  onChange={importWorkflow}
                  className="hidden"
                />
              </label>
              <button
                onClick={() => setShowTemplates(true)}
                className="w-full flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-medium rounded-lg hover:from-orange-600 hover:to-orange-700 transition shadow-sm"
              >
                <FileText className="w-4 h-4" />
                Templates
              </button>
            </div>
          </div>
        </motion.div>

        {/* Canvas with Undo/Redo */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Top Toolbar */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <button
                onClick={undo}
                disabled={historyIndex === 0}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition rounded-lg"
                title="Undo (Ctrl+Z)"
              >
                <Undo2 className="w-4 h-4" />
              </button>
              <button
                onClick={redo}
                disabled={historyIndex === history.length - 1}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition rounded-lg"
                title="Redo (Ctrl+Y)"
              >
                <Redo2 className="w-4 h-4" />
              </button>
              <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {nodes.length - 1} steps • {edges.length} connections
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-950 transition flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Test Run
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-medium rounded-lg hover:from-orange-600 hover:to-orange-700 transition flex items-center gap-2 shadow-sm">
                <Play className="w-4 h-4" />
                Publish
              </button>
            </div>
          </div>

          {/* Canvas */}
          <div
            className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm"
            onDrop={onDrop}
            onDragOver={onDragOver}
          >
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              fitView
              className="bg-gray-50 dark:bg-gray-900"
            >
              <Background
                variant={BackgroundVariant.Dots}
                gap={20}
                size={1}
                color="#e5e7eb"
                className="dark:opacity-20"
              />
              <Controls className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm" />
              <MiniMap
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm"
                nodeColor={(node) => node.style?.background || '#f97316'}
                maskColor="rgba(0, 0, 0, 0.1)"
              />
            </ReactFlow>
          </div>
        </div>

        {/* Right Sidebar - Node Configuration */}
        <AnimatePresence>
          {selectedNode && selectedNode.id !== 'start' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="w-80 flex-shrink-0"
            >
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm h-full overflow-y-auto">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                      <SettingsIcon className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      Node Settings
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedNode(null)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Node Info */}
                  <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Node Type</div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                      {selectedNode.data.nodeType || 'Default'}
                    </div>
                  </div>

                  {/* Node Name */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Node Name
                    </label>
                    <input
                      type="text"
                      defaultValue={selectedNode.data.label}
                      onChange={(e) => {
                        const updatedNodes = nodes.map(n =>
                          n.id === selectedNode.id ? { ...n, data: { ...n.data, label: e.target.value } } : n
                        );
                        setNodes(updatedNodes);
                      }}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                    />
                  </div>

                  {/* App & Event Info */}
                  {selectedNode.data.app && (
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Connected App
                      </label>
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <div className="text-sm font-medium text-blue-900 dark:text-blue-100">
                          {selectedNode.data.app}
                        </div>
                        <div className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                          Event: {selectedNode.data.event}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none transition"
                      placeholder="Describe what this step does..."
                      defaultValue={selectedNode.data.description || ''}
                    />
                  </div>

                  {/* Advanced Settings */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Advanced Settings
                    </h4>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                        <span className="text-sm text-gray-700 dark:text-gray-300">Retry on Failure</span>
                        <input
                          type="checkbox"
                          defaultChecked
                          className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Max Retries
                        </label>
                        <input
                          type="number"
                          defaultValue="3"
                          min="0"
                          max="10"
                          className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Timeout (seconds)
                        </label>
                        <input
                          type="number"
                          defaultValue="30"
                          min="1"
                          max="300"
                          className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4 space-y-2">
                    <button
                      onClick={() => duplicateNode(selectedNode)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-950 transition"
                    >
                      <Copy className="w-4 h-4" />
                      Duplicate Node
                    </button>
                    <button
                      onClick={() => deleteNode(selectedNode.id)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-medium rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Node
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* App Selector Modal */}
      <AnimatePresence>
        {showAppSelector && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => {
              setShowAppSelector(false);
              setCurrentNodeForApp(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl max-w-5xl w-full max-h-[85vh] overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700"
            >
              <div className="flex h-full max-h-[85vh]">
                {/* Left Categories */}
                <div className="w-52 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 p-4 overflow-y-auto">
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                    Categories
                  </h3>
                  <div className="space-y-1">
                    {appCategories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setSelectedCategory(cat.id);
                          setSearchQuery('');
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                          selectedCategory === cat.id
                            ? 'bg-orange-500 text-white shadow-sm'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800'
                        }`}
                      >
                        <cat.icon className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{cat.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Right Content */}
                <div className="flex-1 flex flex-col min-w-0">
                  {/* Search Header */}
                  <div className="p-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Choose an App
                    </h2>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search 7000+ apps..."
                        autoFocus
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                      />
                    </div>
                  </div>

                  {/* Apps Grid */}
                  <div className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900">
                    {filteredApps.length === 0 ? (
                      <div className="text-center py-12">
                        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500 dark:text-gray-400">No apps found</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                        {filteredApps.map((app, idx) => (
                          <button
                            key={idx}
                            onClick={() => addNodeFromApp(app)}
                            className="flex items-center gap-3 p-4 rounded-xl hover:bg-white dark:hover:bg-gray-800 border-2 border-transparent hover:border-orange-500 transition text-left group"
                          >
                            <span className="text-3xl flex-shrink-0 group-hover:scale-110 transition">{app.icon}</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {app.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => {
                  setShowAppSelector(false);
                  setCurrentNodeForApp(null);
                }}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Event Selector Modal */}
      <AnimatePresence>
        {showEventSelector && selectedApp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => {
              setShowEventSelector(false);
              setSelectedApp(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{selectedApp.icon}</span>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {selectedApp.name}
                  </h2>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Choose a trigger or action for this app
                </p>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                {selectedApp.triggers && selectedApp.triggers.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-orange-500" />
                      Triggers
                    </h3>
                    <div className="grid gap-2">
                      {selectedApp.triggers.map((trigger, idx) => (
                        <button
                          key={idx}
                          onClick={() => selectEventForNode(trigger)}
                          className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 hover:bg-orange-50 dark:hover:bg-orange-900/20 border border-gray-200 dark:border-gray-700 hover:border-orange-500 rounded-lg transition text-left group"
                        >
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {trigger}
                          </span>
                          <div className="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center group-hover:bg-orange-500 transition">
                            <Plus className="w-4 h-4 text-orange-600 dark:text-orange-400 group-hover:text-white" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {selectedApp.actions && selectedApp.actions.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                      <Play className="w-4 h-4 text-blue-500" />
                      Actions
                    </h3>
                    <div className="grid gap-2">
                      {selectedApp.actions.map((action, idx) => (
                        <button
                          key={idx}
                          onClick={() => selectEventForNode(action)}
                          className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-gray-200 dark:border-gray-700 hover:border-blue-500 rounded-lg transition text-left group"
                        >
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {action}
                          </span>
                          <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center group-hover:bg-blue-500 transition">
                            <Plus className="w-4 h-4 text-blue-600 dark:text-blue-400 group-hover:text-white" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Close Button */}
              <button
                onClick={() => {
                  setShowEventSelector(false);
                  setSelectedApp(null);
                }}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Templates Modal */}
      <AnimatePresence>
        {showTemplates && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowTemplates(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700"
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                  Workflow Templates
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Start with a pre-built workflow
                </p>
              </div>

              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="grid gap-4">
                  {workflowTemplates.map((template, idx) => (
                    <button
                      key={idx}
                      onClick={() => loadTemplate(template)}
                      className="p-5 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 hover:from-orange-50 hover:to-orange-100 dark:hover:from-orange-900/20 dark:hover:to-orange-900/10 border border-gray-200 dark:border-gray-700 hover:border-orange-500 rounded-xl transition text-left group"
                    >
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition">
                        {template.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {template.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded">
                          {template.trigger.app}
                        </span>
                        <span className="text-gray-400">→</span>
                        {template.actions.map((action, i) => (
                          <span key={i} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">
                            {action.app}
                          </span>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setShowTemplates(false)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};