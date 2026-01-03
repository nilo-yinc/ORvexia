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
import { AppLogos } from './AppLogos';

// --- Configuration Data ---
const popularApps = [
  { name: 'Microsoft Excel', logo: 'excel', category: 'apps', triggers: ['New Row', 'Updated Row'], actions: ['Add Row', 'Update Row', 'Find Row'] },
  { name: 'Google Drive', logo: 'drive', category: 'apps', triggers: ['New File', 'New Folder'], actions: ['Upload File', 'Create Folder', 'Move File'] },
  { name: 'Gmail', logo: 'gmail', category: 'apps', triggers: ['New Email', 'New Labeled Email'], actions: ['Send Email', 'Create Draft', 'Add Label'] },
  { name: 'Notion', logo: 'notion', category: 'apps', triggers: ['New Database Item', 'Updated Page'], actions: ['Create Page', 'Update Database Item'] },
  { name: 'Telegram', logo: 'telegram', category: 'apps', triggers: ['New Message', 'New Channel Post'], actions: ['Send Message', 'Send Photo'] },
  { name: 'GitHub', logo: 'github', category: 'apps', triggers: ['New Issue', 'Push Event'], actions: ['Create Issue', 'Create PR'] },
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

const appCategories = [
  { id: 'home', label: 'All Apps', icon: Zap },
  { id: 'apps', label: 'Connected Apps', icon: Globe },
  { id: 'flow-controls', label: 'Flow Controls', icon: Filter },
];

const initialNodes = [
  {
    id: 'start',
    type: 'input',
    data: { label: 'Start Workflow', nodeType: 'trigger' },
    position: { x: 250, y: 50 },
    style: {
      background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', 
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      padding: '20px 40px',
      fontWeight: '600',
      fontSize: '16px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
      textAlign: 'center',
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
        className="bg-[#0B0D14]" 
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#334155" />
        <Controls className="bg-[#1e293b] border-none fill-white text-white rounded-lg shadow-xl" style={{ button: { backgroundColor: '#1e293b', fill: 'white' } }} />
        <MiniMap className="bg-[#1e293b] border-none rounded-lg shadow-xl" nodeColor={(node) => node.style?.background || '#3b82f6'} maskColor="rgba(0, 0, 0, 0.3)" />
      </ReactFlow>

      {/* FIXED BOTTOM TOOLBAR */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-[#111827] border border-[#374151] rounded-xl shadow-2xl px-4 py-2 flex items-center gap-3">
          <button onClick={undo} disabled={historyIndex === 0} className="p-2 hover:bg-[#1f2937] rounded-lg disabled:opacity-30 transition text-gray-400 hover:text-white" title="Undo">
            <Undo2 className="w-4 h-4" />
          </button>
          <button onClick={redo} disabled={historyIndex === history.length - 1} className="p-2 hover:bg-[#1f2937] rounded-lg disabled:opacity-30 transition text-gray-400 hover:text-white" title="Redo">
            <Redo2 className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-[#374151]" />
          <button onClick={() => zoomOut()} className="p-2 hover:bg-[#1f2937] rounded-lg transition text-gray-400 hover:text-white"><ZoomOut className="w-4 h-4" /></button>
          <button onClick={() => zoomIn()} className="p-2 hover:bg-[#1f2937] rounded-lg transition text-gray-400 hover:text-white"><ZoomIn className="w-4 h-4" /></button>
          <button onClick={() => fitView()} className="p-2 hover:bg-[#1f2937] rounded-lg transition text-gray-400 hover:text-white"><Maximize2 className="w-4 h-4" /></button>
          <div className="w-px h-6 bg-[#374151]" />
          <button onClick={() => setShowAppSelector(true)} className="flex items-center gap-2 px-4 py-2 bg-[#1f2937] hover:bg-[#374151] text-white text-sm font-medium rounded-lg transition border border-[#374151]">
            <Plus className="w-4 h-4" /> Add Block
          </button>
          <button className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold rounded-lg transition flex items-center gap-2 shadow-lg shadow-orange-900/20">
            <Play className="w-4 h-4 fill-current" /> Run <ChevronUp className="w-3 h-3" />
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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo(); }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) { e.preventDefault(); redo(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, history]);

  const onConnect = useCallback((params) => {
    const newEdges = addEdge({ ...params, animated: true, type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed, color: '#64748b' }, style: { stroke: '#64748b', strokeWidth: 2 } }, edges);
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
    // Styling for new nodes to match the dark UI
    const nodeStyle = {
      background: '#1f2937', // Dark background color
      color: '#ffffff',       // White text color
      border: '1px solid #374151', // Subtle dark border
      borderRadius: '12px',
      padding: '16px 24px',
      fontWeight: '600',
      fontSize: '14px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)', // Darker shadow
      minWidth: '200px',
      textAlign: 'center',
    };

    if (!currentNodeForApp) {
        const newNode = {
            id: `node_${nodeIdCounter}`,
            type: 'default',
            data: {
              label: `${selectedApp.name}: ${event}`,
              nodeType: 'Action',
              icon: selectedApp.logo, 
              app: selectedApp.name,
              event: event,
              description: `Action using ${selectedApp.name}`
            },
            position: { x: 250 + Math.random() * 50, y: 150 + Math.random() * 50 },
            style: nodeStyle,
          };
          setNodeIdCounter(nodeIdCounter + 1);
          const newNodes = [...nodes, newNode];
          setNodes(newNodes);
          saveHistory(newNodes, edges);
    } else {
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
                style: nodeStyle
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

  const deleteNode = (nodeId) => {
    const newNodes = nodes.filter(n => n.id !== nodeId);
    const newEdges = edges.filter(e => e.source !== nodeId && e.target !== nodeId);
    setNodes(newNodes);
    setEdges(newEdges);
    saveHistory(newNodes, newEdges);
    setSelectedNode(null);
  };

  const duplicateNode = (node) => {
    const newNode = { ...node, id: `node_${nodeIdCounter}`, position: { x: node.position.x + 50, y: node.position.y + 50 } };
    setNodeIdCounter(nodeIdCounter + 1);
    const newNodes = [...nodes, newNode];
    setNodes(newNodes);
    saveHistory(newNodes, edges);
  };

  const onNodeClick = (event, node) => setSelectedNode(node);

  const filteredApps = [...popularApps, ...builtInTools].filter(app => {
    const matchesSearch = searchQuery === '' || app.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'home' ? true : app.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="h-screen flex flex-col bg-[#0B0D14] overflow-hidden text-gray-100">
      
      {/* FIXED HEADER */}
      <div className="h-14 bg-[#111827] border-b border-[#1f2937] flex items-center justify-between px-6 flex-shrink-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/workflows')} className="flex items-center gap-2 text-gray-400 hover:text-white transition text-sm font-medium">
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <div className="h-6 w-px bg-[#374151] mx-2" />
          <input
            type="text"
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            className="bg-transparent border-none text-sm font-medium text-white focus:ring-0 p-0 w-64 placeholder-gray-500"
            placeholder="Name your workflow..."
          />
        </div>
        
        {/* Right side simple actions */}
        <div className="flex items-center gap-3">
           <button className="text-sm text-gray-400 hover:text-white transition">Saved</button>
           <button className="p-2 hover:bg-[#1f2937] rounded-full transition text-gray-400">
             <SettingsIcon className="w-5 h-5" />
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

        {/* RIGHT SIDEBAR - NODE SETTINGS */}
        <AnimatePresence>
          {selectedNode && selectedNode.id !== 'start' && (
            <motion.div
              initial={{ x: 320 }} animate={{ x: 0 }} exit={{ x: 320 }}
              className="w-96 bg-[#111827] border-l border-[#1f2937] flex flex-col flex-shrink-0 z-20 shadow-2xl"
            >
              {/* Sidebar Header */}
              <div className="p-5 border-b border-[#1f2937] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-orange-600 rounded-md">
                    <SettingsIcon className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-base font-bold text-white">Node Settings</h3>
                </div>
                <button onClick={() => setSelectedNode(null)} className="text-gray-500 hover:text-white transition">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 overflow-y-auto space-y-6">
                
                {/* Node Type Display */}
                <div>
                   <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Node Type</label>
                   <div className="text-sm font-medium text-white bg-[#1f2937] px-3 py-2 rounded-lg border border-[#374151]">
                      {selectedNode.data.nodeType || 'Action'}
                   </div>
                </div>

                {/* Node Name Input */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Node Name</label>
                  <input
                    type="text"
                    value={selectedNode.data.label}
                    onChange={(e) => {
                      const updatedNodes = nodes.map(n => n.id === selectedNode.id ? { ...n, data: { ...n.data, label: e.target.value } } : n);
                      setNodes(updatedNodes);
                    }}
                    className="w-full px-3 py-2.5 bg-[#1f2937] border border-[#374151] rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  />
                </div>

                {/* Connected App Card */}
                {selectedNode.data.app && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Connected App</label>
                    <div className="p-4 bg-[#1f2937] border border-[#374151] rounded-xl flex items-start gap-4">
                      <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-[#111827] rounded-lg border border-[#374151]">
                         {selectedNode.data.icon ? <AppLogos name={selectedNode.data.icon} className="w-6 h-6"/> : <Zap className="w-6 h-6 text-white"/>}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">{selectedNode.data.app}</div>
                        <div className="text-xs text-orange-500 mt-1 font-medium">Event: {selectedNode.data.event}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Description</label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2.5 bg-[#1f2937] border border-[#374151] rounded-lg text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none transition"
                    placeholder="Describe what this step does..."
                    defaultValue={selectedNode.data.description || ''}
                  />
                </div>

                {/* Advanced Settings Section */}
                <div className="pt-2">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Advanced Settings</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-[#1f2937] border border-[#374151] rounded-lg">
                      <span className="text-sm font-medium text-gray-300">Retry on Failure</span>
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-orange-600 bg-[#111827] border-gray-600 rounded focus:ring-orange-500 focus:ring-2" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-2">Max Retries</label>
                      <input type="number" defaultValue="3" min="0" max="10" className="w-full px-3 py-2 bg-[#1f2937] border border-[#374151] rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-2">Timeout (seconds)</label>
                      <input type="number" defaultValue="30" min="1" max="300" className="w-full px-3 py-2 bg-[#1f2937] border border-[#374151] rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition" />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 grid grid-cols-2 gap-3">
                  <button onClick={() => duplicateNode(selectedNode)} className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1f2937] text-gray-300 font-medium rounded-lg hover:bg-[#374151] hover:text-white transition border border-[#374151]">
                    <Copy className="w-4 h-4" /> Duplicate
                  </button>
                  <button onClick={() => deleteNode(selectedNode.id)} className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-900/20 text-red-400 font-medium rounded-lg hover:bg-red-900/40 transition border border-red-900/30">
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* App Selector Modal - Dark Theme */}
      <AnimatePresence>
        {showAppSelector && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
            onClick={() => setShowAppSelector(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#111827] rounded-xl max-w-4xl w-full max-h-[85vh] overflow-hidden shadow-2xl border border-[#374151] flex"
            >
               {/* Categories Sidebar */}
               <div className="w-56 bg-[#0B0D14] border-r border-[#1f2937] p-4 overflow-y-auto">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 px-2">Categories</h3>
                  <div className="space-y-1">
                    {appCategories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => { setSelectedCategory(cat.id); setSearchQuery(''); }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                          selectedCategory === cat.id ? 'bg-orange-600 text-white' : 'text-gray-400 hover:bg-[#1f2937] hover:text-white'
                        }`}
                      >
                        <cat.icon className="w-4 h-4" />
                        {cat.label}
                      </button>
                    ))}
                  </div>
               </div>

               <div className="flex-1 flex flex-col bg-[#111827]">
                  <div className="p-6 border-b border-[#1f2937]">
                    <h2 className="text-xl font-bold text-white mb-4">Choose an App</h2>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search apps..."
                        autoFocus
                        className="w-full pl-10 pr-4 py-3 bg-[#1f2937] border border-[#374151] rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="p-6 overflow-y-auto max-h-[60vh]">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {filteredApps.map((app, idx) => (
                        <button
                          key={idx}
                          onClick={() => addNodeFromApp(app)}
                          className="flex items-center gap-4 p-4 bg-[#1f2937] rounded-xl hover:ring-2 hover:ring-orange-500 border border-[#374151] transition text-left group hover:bg-[#2d3748]"
                        >
                          <div className="w-10 h-10 flex items-center justify-center bg-[#111827] rounded-full group-hover:scale-110 transition shrink-0 border border-[#374151]">
                              {app.logo ? (
                                <AppLogos name={app.logo} className="w-6 h-6" />
                              ) : (
                                typeof app.icon === 'string' ? <span className="text-xl">{app.icon}</span> : <app.icon className="w-5 h-5 text-gray-400" />
                              )}
                          </div>
                          <span className="text-sm font-semibold text-gray-200 group-hover:text-white truncate">
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

      {/* Event Selector Modal - Dark Theme */}
      <AnimatePresence>
        {showEventSelector && selectedApp && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
            onClick={() => { setShowEventSelector(false); setSelectedApp(null); }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#111827] rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl border border-[#374151]"
            >
               <div className="p-6 border-b border-[#1f2937] flex items-center gap-4 bg-[#1f2937]/50">
                  <div className="w-14 h-14 flex items-center justify-center bg-[#111827] rounded-xl border border-[#374151]">
                     {selectedApp.logo ? <AppLogos name={selectedApp.logo} className="w-8 h-8" /> : <Zap className="w-8 h-8 text-orange-500" />}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedApp.name}</h2>
                    <p className="text-sm text-gray-400">Choose a trigger or action</p>
                  </div>
               </div>
               <div className="p-6 overflow-y-auto max-h-[60vh] space-y-8">
                  {selectedApp.triggers && (
                    <div>
                      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Zap className="w-3 h-3" /> Triggers
                      </h3>
                      <div className="grid gap-2">
                        {selectedApp.triggers.map((t, i) => (
                           <button key={i} onClick={() => selectEventForNode(t)} className="w-full text-left p-4 rounded-lg bg-[#1f2937] border border-[#374151] hover:border-orange-500 hover:bg-[#2d3748] transition flex items-center justify-between group">
                              <span className="text-sm font-medium text-gray-200 group-hover:text-white">{t}</span>
                              <Plus className="w-4 h-4 text-gray-500 group-hover:text-orange-500" />
                           </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedApp.actions && (
                    <div>
                      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Play className="w-3 h-3" /> Actions
                      </h3>
                      <div className="grid gap-2">
                        {selectedApp.actions.map((a, i) => (
                           <button key={i} onClick={() => selectEventForNode(a)} className="w-full text-left p-4 rounded-lg bg-[#1f2937] border border-[#374151] hover:border-blue-500 hover:bg-[#2d3748] transition flex items-center justify-between group">
                              <span className="text-sm font-medium text-gray-200 group-hover:text-white">{a}</span>
                              <Plus className="w-4 h-4 text-gray-500 group-hover:text-blue-500" />
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