import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus, Play, Edit, Trash2, MoreVertical, Clock, Search } from 'lucide-react';
import { workflows } from '../utils/mockData';

// Function to map workflow names to high-quality logos
const getWorkflowIcons = (name) => {
  const n = name.toLowerCase();
  if (n.includes('customer')) return { 
    left: "https://cdn-icons-png.flaticon.com/512/3002/3002231.png", // Google People/CRM
    right: "https://cdn-icons-png.flaticon.com/512/5968/5968923.png" // Slack
  };
  if (n.includes('invoice')) return { 
    left: "https://cdn-icons-png.flaticon.com/512/2306/2306086.png", // Invoice/Doc
    right: "https://cdn-icons-png.flaticon.com/512/5968/5968350.png" // Salesforce
  };
  if (n.includes('email')) return { 
    left: "https://cdn-icons-png.flaticon.com/512/281/281769.png", // Gmail
    right: "https://cdn-icons-png.flaticon.com/512/906/906361.png" // Mailchimp
  };
  if (n.includes('data') || n.includes('sync')) return { 
    left: "https://cdn-icons-png.flaticon.com/512/5968/5968313.png", // Notion
    right: "https://cdn-icons-png.flaticon.com/512/5968/5968242.png" // Google Sheets
  };
  return { 
    left: "https://cdn-icons-png.flaticon.com/512/3858/3858684.png", 
    right: "https://cdn-icons-png.flaticon.com/512/11516/11516645.png" 
  };
};

export const Workflows = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f9fafb] dark:bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Search Bar - Top Section */}
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search workflows..." 
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>

        {/* Header - Compact */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Workflows</h1>
            <p className="text-xs text-gray-500 mt-0.5">Automate your processes with ease.</p>
          </div>
          <button
            onClick={() => navigate('/workflows/builder')}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#ff4f00] hover:bg-[#e64600] text-white text-xs font-bold rounded-full transition-all shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            Create Zap
          </button>
        </div>

        {/* Stats - Small size */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Active Workflows', value: '3' },
            { label: 'Drafts', value: '0' },
            { label: 'Success Rate', value: '96.2%' },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-lg p-3 shadow-sm">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-tight">{stat.label}</p>
              <p className="text-lg font-bold text-gray-800 dark:text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Workflows Grid - 3 Columns with smaller cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {workflows.map((workflow, idx) => {
            const icons = getWorkflowIcons(workflow.name);
            return (
              <motion.div
                key={workflow.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="group bg-white dark:bg-[#111] border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                {/* Visual Header - Icon Bridge */}
                <div className="h-28 bg-[#f8fafc] dark:bg-[#161616] flex items-center justify-center relative border-b border-gray-50 dark:border-gray-800">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-lg shadow-sm flex items-center justify-center p-2 border border-gray-100 dark:border-gray-700">
                      <img src={icons.left} alt="tool1" className="w-full h-full object-contain" />
                    </div>
                    <div className="w-8 h-[1px] bg-gray-300 dark:bg-gray-700 mx-1"></div>
                    <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-lg shadow-sm flex items-center justify-center p-2 border border-gray-100 dark:border-gray-700">
                      <img src={icons.right} alt="tool2" className="w-full h-full object-contain" />
                    </div>
                  </div>
                  <button className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600">
                    <MoreVertical className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Body Section - Smaller Text */}
                <div className="p-4">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${workflow.status === 'active' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{workflow.status}</span>
                  </div>
                  
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1 truncate">
                    {workflow.name}
                  </h3>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-1 mb-4">
                    {workflow.description}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-50 dark:border-gray-800">
                    <div>
                      <p className="text-[9px] uppercase font-bold text-gray-400">Executions</p>
                      <p className="text-xs font-bold text-gray-400">1,247</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] uppercase font-bold text-gray-400">Success</p>
                      <p className="text-xs font-bold text-green-600">{workflow.successRate}%</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};