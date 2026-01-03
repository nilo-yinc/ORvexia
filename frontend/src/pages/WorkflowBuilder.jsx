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
  useReactFlow,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Save,
  Download,
  Upload,
  Zap,
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
  ZoomIn,
  ZoomOut,
  Maximize2,
  ChevronUp
} from 'lucide-react';
import { AppLogos } from './AppLogos'; // Import the logos

// Update popularApps to use 'logo' key
const popularApps = [
  { name: 'Microsoft Excel', logo: 'excel', category: 'apps', triggers: ['New Row', 'Updated Row'], actions: ['Add Row', 'Update Row', 'Find Row'] },
  { name: 'Google Drive', logo: 'drive', category: 'apps', triggers: ['New File', 'New Folder'], actions: ['Upload File', 'Create Folder', 'Move File'] },
  { name: 'Gmail', logo: 'gmail', category: 'apps', triggers: ['New Email', 'New Labeled Email'], actions: ['Send Email', 'Create Draft', 'Add Label'] },
  { name: 'Notion', logo: 'notion', category: 'apps', triggers: ['New Database Item', 'Updated Page'], actions: ['Create Page', 'Update Database Item'] },
  { name: 'Telegram', logo: 'telegram', category: 'apps', triggers: ['New Message', 'New Channel Post'], actions: ['Send Message', 'Send Photo'] },
  { name: 'GitHub', logo: 'github', category: 'apps', triggers: ['New Issue', 'Push Event'], actions: ['Create Issue', 'Create PR'] }, // Added GitHub
  { name: 'Google Calendar', logo: 'calendar', category: 'apps', triggers: ['Event Start', 'New Event'], actions: ['Create Event', 'Update Event'] },
  { name: 'Google Sheets', logo: 'sheets', category: 'apps', triggers: ['New Row', 'Updated Row'], actions: ['Create Row', 'Update Row', 'Clear Row'] },
  { name: 'Slack', logo: 'slack', category: 'apps', triggers: ['New Message', 'New Reaction'], actions: ['Send Message', 'Send Direct Message'] },
  { name: 'HubSpot', logo: 'hubspot', category: 'apps', triggers: ['New Contact', 'Updated Deal'], actions: ['Create Contact', 'Update Contact'] },
  { name: 'Google Forms', logo: 'googleforms', category: 'apps', triggers: ['New Response'], actions: ['Create Form'] },
  { name: 'Facebook Lead Ads', logo: 'facebook', category: 'apps', triggers: ['New Lead'], actions: [] },
  { name: 'Mailchimp', logo: 'mailchimp', category: 'apps', triggers: ['New Subscriber', 'Unsubscribe'], actions: ['Add Subscriber', 'Update Subscriber'] },
  { name: 'Microsoft Outlook', logo: 'outlook', category: 'apps', triggers: ['New Email'], actions: ['Send Email', 'Create Event'] },
  { name: 'Trello', logo: 'trello', category: 'apps', triggers: ['New Card', 'Card Moved'], actions: ['Create Card', 'Update Card', 'Move Card'] },
  { name: 'Stripe', logo: 'stripe', category: 'apps', triggers: ['New Payment', 'Failed Payment'], actions: ['Create Customer', 'Create Invoice'] },
  { name: 'Twitter', logo: 'twitter', category: 'apps', triggers: ['New Tweet', 'New Mention'], actions: ['Post Tweet', 'Like Tweet'] },
];

const builtInTools = [
  { name: 'Webhooks', icon: Zap, category: 'home', triggers: ['Catch Hook'], actions: ['POST Request', 'GET Request'] },
  { name: 'Schedule', icon: Clock, category: 'home', triggers: ['Every Hour', 'Every Day', 'Custom'], actions: [] },
  { name: 'Email', icon: '📨', category: 'home', triggers: ['New Email'], actions: ['Send Email'] },
  { name: 'RSS', icon: '📡', category: 'home', triggers: ['New Item in Feed'], actions: [] },
  { name: 'Code', icon: Code, category: 'home', triggers: [], actions: ['Run JavaScript', 'Run Python'] },
  { name: 'Email Parser', icon: '📬', category: 'home', triggers: ['New Email'], actions: ['Parse Email'] },
  { name: 'Storage', icon: '💾', category: 'home', triggers: [], actions: ['Store Value', 'Get Value'] },
  { name: 'Formatter', icon: '✨', category: 'utilities', triggers: [], actions: ['Format Text', 'Format Date', 'Format Number'] },
  { name: 'Filter', icon: Filter, category: 'flow-controls', triggers: [], actions: ['Continue If', 'Stop If'] },
  { name: 'Paths', icon: GitBranch, category: 'flow-controls', triggers: [], actions: ['Split Path'] },
  { name: 'Delay', icon: Clock, category: 'flow-controls', triggers: [], actions: ['Delay For', 'Delay Until'] },
];

// Note: Reusing the same templates, but updating trigger/action refs if needed
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

const WorkflowCanvasInner = ({ 
  nodes, edges, onNodesChange, onEdgesChange, onConnect, onNodeClick, 
  undo, redo, historyIndex, history, addNodeFromApp, setShowAppSelector 
}) => {
  const { fitView, zoomIn, zoomOut } = useReactFlow();

  return (
    <>
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
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#e5e7eb" className="dark:opacity-20" />
        <Controls className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm" />
        <MiniMap className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm" />
      </ReactFlow>

      {/* FIXED LOWER SIDEBAR (Bottom Toolbar) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-xl shadow-2xl px-4 py-2 flex items-center gap-3">
          <button
            onClick={undo}
            disabled={historyIndex === 0}
            className="p-2 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] rounded disabled:opacity-30 transition text-gray-600 dark:text-gray-300"
            title="Undo"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={redo}
            disabled={historyIndex === history.length - 1}
            className="p-2 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] rounded disabled:opacity-30 transition text-gray-600 dark:text-gray-300"
            title="Redo"
          >
            <Redo2 className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-gray-200 dark:bg-[#2a2a2a]" />

          <button onClick={() => zoomOut()} className="p-2 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] rounded transition text-gray-600 dark:text-gray-300" title="Zoom Out">
            <ZoomOut className="w-4 h-4" />
          </button>
          <button onClick={() => zoomIn()} className="p-2 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] rounded transition text-gray-600 dark:text-gray-300" title="Zoom In">
            <ZoomIn className="w-4 h-4" />
          </button>
          <button onClick={() => fitView()} className="p-2 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] rounded transition text-gray-600 dark:text-gray-300" title="Fit View">
            <Maximize2 className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-gray-200 dark:bg-[#2a2a2a]" />

          {/* Trigger the App Selector Modal */}
          <button
            onClick={() => setShowAppSelector(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-[#2a2a2a] hover:bg-gray-200 dark:hover:bg-[#3a3a3a] text-gray-900 dark:text-white text-sm font-medium rounded-lg transition"
          >
            <Plus className="w-4 h-4" />
            Add Block
          </button>

          <button className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition flex items-center gap-2 shadow-sm">
            <Play className="w-4 h-4" />
            Run
            <ChevronUp className="w-3 h-3" />
          </button>
        </div>
      </div>
    </>
  );
};

export const WorkflowBuilder = () => {
  const navigate = useNavigate();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState(null);
  const [workflowName, setWorkflowName] = useState('Untitled Workflow');
  const [showAppSelector, setShowAppSelector] = useState(false);
  const [showEventSelector, setShowEventSelector] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('home');
  const [history, setHistory] = useState([{ nodes: initialNodes, edges: initialEdges }]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [nodeIdCounter, setNodeIdCounter] = useState(1);
  const [currentNodeForApp, setCurrentNodeForApp] = useState(null);

  // Undo/Redo Logic
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo(); }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) { e.preventDefault(); redo(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, history]);

  const onConnect = useCallback((params) => {
    const newEdges = addEdge({ ...params, animated: true, type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } }, edges);
    setEdges(newEdges);
    saveHistory(nodes, newEdges);
  }, [edges, nodes]);

  const saveHistory = (newNodes, newEdges) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ nodes: newNodes, edges: newEdges });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setNodes(history[historyIndex - 1].nodes);
      setEdges(history[historyIndex - 1].edges);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setNodes(history[historyIndex + 1].nodes);
      setEdges(history[historyIndex + 1].edges);
    }
  };

  const addNodeFromApp = (app) => {
    setSelectedApp(app);
    setShowAppSelector(false);
    setShowEventSelector(true);
  };

  const selectEventForNode = (event) => {
    // If adding a fresh node from selector
    if (!currentNodeForApp) {
        const newNode = {
            id: `node_${nodeIdCounter}`,
            type: 'default',
            data: {
              label: `${selectedApp.name}: ${event}`,
              nodeType: 'action',
              icon: selectedApp.logo, // We store the logo key here
              app: selectedApp.name,
              event: event,
              description: `Action using ${selectedApp.name}`
            },
            position: { x: 250 + Math.random() * 50, y: 150 + Math.random() * 50 },
            style: {
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '10px',
              padding: '12px 20px',
              fontWeight: '500',
              fontSize: '13px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              minWidth: '180px',
            },
          };
          setNodeIdCounter(nodeIdCounter + 1);
          const newNodes = [...nodes, newNode];
          setNodes(newNodes);
          saveHistory(newNodes, edges);
    } else {
        // If updating an existing node (unlikely in this flow but keeping logic)
        const updatedNodes = nodes.map(node => {
            if (node.id === currentNodeForApp) {
              return {
                ...node,
                data: {
                  ...node.data,
                  label: `${selectedApp.name}: ${event}`,
                  app: selectedApp.name,
                  event: event,
                  icon: selectedApp.logo,
                  needsConfiguration: false,
                },
              };
            }
            return node;
          });
          setNodes(updatedNodes);
          saveHistory(updatedNodes, edges);
    }
    
    setShowEventSelector(false);
    setSelectedApp(null);
    setCurrentNodeForApp(null);
  };

  const onNodeClick = (event, node) => setSelectedNode(node);

  // Filter apps based on search
  const filteredApps = [...popularApps, ...builtInTools].filter(app => {
    const matchesSearch = searchQuery === '' || app.name.toLowerCase().includes(searchQuery.toLowerCase());
    // Simplified category filter for brevity
    const matchesCategory = selectedCategory === 'home' ? true : app.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const appCategories = [
    { id: 'home', label: 'All Apps', icon: Zap },
    { id: 'apps', label: 'Connected Apps', icon: Globe },
    { id: 'flow-controls', label: 'Flow Controls', icon: Filter },
  ];

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-[#111111] overflow-hidden">
      {/* Top Header */}
      <div className="h-14 bg-white dark:bg-[#1a1a1a] border-b border-gray-200 dark:border-[#2a2a2a] flex items-center justify-between px-4 flex-shrink-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/workflows')} className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            className="bg-transparent border-none text-sm font-semibold text-gray-900 dark:text-white focus:ring-0 p-0"
          />
        </div>
        <div className="flex items-center gap-2">
           <button className="p-2 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] rounded transition">
             <SettingsIcon className="w-4 h-4 text-gray-500" />
           </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Canvas Area */}
        <div className="flex-1 relative">
           <ReactFlowProvider>
              <WorkflowCanvasInner 
                nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
                onConnect={onConnect} onNodeClick={onNodeClick} undo={undo} redo={redo}
                historyIndex={historyIndex} history={history} 
                addNodeFromApp={addNodeFromApp} setShowAppSelector={setShowAppSelector}
              />
           </ReactFlowProvider>
        </div>

        {/* Right Sidebar */}
        <AnimatePresence>
          {selectedNode && (
            <motion.div
              initial={{ x: 320 }} animate={{ x: 0 }} exit={{ x: 320 }}
              className="w-80 bg-white dark:bg-[#1a1a1a] border-l border-gray-200 dark:border-[#2a2a2a] flex flex-col flex-shrink-0 z-20 shadow-xl"
            >
              <div className="p-4 border-b border-gray-200 dark:border-[#2a2a2a] flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Node Settings</h3>
                <button onClick={() => setSelectedNode(null)}>
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              <div className="p-4">
                 {/* Node configuration content here */}
                 <div className="mb-4">
                    <label className="block text-xs text-gray-500 mb-1">Label</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-[#111111] border border-gray-200 dark:border-[#2a2a2a] rounded text-sm text-gray-900 dark:text-white"
                      value={selectedNode.data.label}
                      onChange={(e) => {
                        const updated = nodes.map(n => n.id === selectedNode.id ? { ...n, data: { ...n.data, label: e.target.value } } : n);
                        setNodes(updated);
                      }}
                    />
                 </div>
                 {selectedNode.data.app && (
                   <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-[#111111] rounded mb-4">
                      {/* Show logo in sidebar */}
                      <AppLogos name={selectedNode.data.icon || 'default'} className="w-6 h-6" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{selectedNode.data.app}</span>
                   </div>
                 )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* App Selector Modal (Triggered by Bottom Bar) */}
      <AnimatePresence>
        {showAppSelector && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
            onClick={() => setShowAppSelector(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-[#1a1a1a] rounded-xl max-w-4xl w-full max-h-[85vh] overflow-hidden shadow-2xl border border-gray-200 dark:border-[#2a2a2a] flex"
            >
               {/* Categories Sidebar inside Modal */}
               <div className="w-48 bg-gray-50 dark:bg-[#222] border-r border-gray-200 dark:border-[#2a2a2a] p-3 overflow-y-auto">
                  <div className="space-y-1">
                    {appCategories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => { setSelectedCategory(cat.id); setSearchQuery(''); }}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition ${
                          selectedCategory === cat.id ? 'bg-orange-500 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#333]'
                        }`}
                      >
                        <cat.icon className="w-4 h-4" />
                        {cat.label}
                      </button>
                    ))}
                  </div>
               </div>

               <div className="flex-1 flex flex-col">
                  <div className="p-5 border-b border-gray-200 dark:border-[#2a2a2a]">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search apps..."
                        autoFocus
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-[#111111] border border-gray-200 dark:border-[#2a2a2a] rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>

                  <div className="p-5 overflow-y-auto max-h-[60vh] bg-white dark:bg-[#1a1a1a]">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {filteredApps.map((app, idx) => (
                        <button
                          key={idx}
                          onClick={() => addNodeFromApp(app)}
                          className="flex items-center gap-3 p-3 bg-white dark:bg-[#1a1a1a] rounded-lg hover:ring-2 hover:ring-orange-500 border border-gray-200 dark:border-[#2a2a2a] transition text-left group"
                        >
                          {/* REAL LOGO RENDERING */}
                          <div className="w-10 h-10 flex items-center justify-center bg-gray-50 dark:bg-[#222] rounded-full group-hover:scale-110 transition shrink-0">
                              {app.logo ? (
                                <AppLogos name={app.logo} className="w-6 h-6" />
                              ) : (
                                // Fallback for builtin tools using icons or strings
                                typeof app.icon === 'string' ? <span className="text-xl">{app.icon}</span> : <app.icon className="w-5 h-5 text-gray-500" />
                              )}
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {app.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Event Selector Modal */}
      <AnimatePresence>
        {showEventSelector && selectedApp && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
            onClick={() => { setShowEventSelector(false); setSelectedApp(null); }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-[#1a1a1a] rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl border border-gray-200 dark:border-[#2a2a2a]"
            >
               <div className="p-6 border-b border-gray-200 dark:border-[#2a2a2a] flex items-center gap-3">
                  <div className="w-12 h-12 flex items-center justify-center bg-gray-50 dark:bg-[#222] rounded-full">
                     {selectedApp.logo ? <AppLogos name={selectedApp.logo} className="w-7 h-7" /> : <Zap className="w-6 h-6" />}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{selectedApp.name}</h2>
                    <p className="text-sm text-gray-500">Choose a trigger or action</p>
                  </div>
               </div>
               <div className="p-6 overflow-y-auto max-h-[60vh] space-y-6">
                  {selectedApp.triggers && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Triggers</h3>
                      <div className="grid gap-2">
                        {selectedApp.triggers.map((t, i) => (
                           <button key={i} onClick={() => selectEventForNode(t)} className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-[#333] hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/10 transition flex items-center justify-between group">
                              <span className="text-sm font-medium text-gray-900 dark:text-white">{t}</span>
                              <Plus className="w-4 h-4 text-gray-400 group-hover:text-orange-500" />
                           </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedApp.actions && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Actions</h3>
                      <div className="grid gap-2">
                        {selectedApp.actions.map((a, i) => (
                           <button key={i} onClick={() => selectEventForNode(a)} className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-[#333] hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition flex items-center justify-between group">
                              <span className="text-sm font-medium text-gray-900 dark:text-white">{a}</span>
                              <Plus className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
                           </button>
                        ))}
                      </div>
                    </div>
                  )}
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};