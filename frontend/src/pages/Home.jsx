import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Workflow, 
  Sparkles, 
  BarChart3, 
  FolderKanban, 
  Settings,
  ArrowRight,
  Zap,
  TrendingUp,
  Clock,
  CheckCircle2,
  Play,
  Plus,
  Users,
  Mic,
  Send,
  Grid3x3,
  Table,
  Square,
  MessageSquare,
  Search,
  Filter,
  Activity
} from 'lucide-react';

export const Home = () => {
  const navigate = useNavigate();

  const startFromScratch = [
    { 
      icon: Zap, 
      label: 'Workflow', 
      description: 'Automated workflows',
      path: '/workflows/builder',
      color: 'from-orange-500 to-orange-600'
    },
    { 
      icon: Sparkles, 
      label: 'AI Builder', 
      description: 'AI-powered automation',
      path: '/ai-builder',
      color: 'from-purple-500 to-purple-600'
    },
    { 
      icon: BarChart3, 
      label: 'Analytics', 
      description: 'Track performance metrics',
      path: '/analytics',
      color: 'from-blue-500 to-blue-600'
    },
    { 
      icon: FolderKanban, 
      label: 'Templates', 
      description: 'Browse workflow templates',
      path: '/templates',
      color: 'from-green-500 to-green-600'
    },
    { 
      icon: Activity, 
      label: 'Monitoring', 
      description: 'Real-time system monitoring',
      path: null,
      color: 'from-pink-500 to-pink-600'
    },
  ];

  const recommendedTemplates = [
    {
      title: 'AI Chat for Lead Generation',
      apps: ['AI Chatbot', 'CRM'],
      uses: '15.8k',
      image: 'https://botup.com/images/kp/chatbots-for-lead-generation.png',
    },
    {
      title: 'AI Email Assistant',
      apps: ['Gmail', 'AI Assistant'],
      uses: '22.4k',
      image: 'https://zapier.com/api/templates/v1/media/file/de3421b43a7c5615d3d0d4f2c6596c43-Thumbnail_8__1_.webp',
    },
    {
      title: 'Create GitHub issues from Slack',
      apps: ['Slack', 'GitHub'],
      uses: '18.6k',
      image: 'https://zapier.com/api/templates/v1/media/file/59162f0401c11000debd07c11f51f004-Sales_Prep_Guide-1.webp',
    },
    {
      title: 'Increase sales leads from support tickets',
      apps: ['Support Desk', 'CRM'],
      uses: '12.9k',
      image: 'https://zapier.com/api/templates/v1/media/file/62e8b5f59857790881a88ca5d60b715d-Potential_Deal_Flag_Zap.webp',
    },
    {
      title: 'Auto-capture tool updates from Slack',
      apps: ['Slack', 'Notion'],
      uses: '9.4k',
      image: 'https://zapier.com/api/templates/v1/media/file/f43569bf21fa6fc820fdb937953344bd-Changelog-1.webp',
    },
    {
      title: 'Applicant Tracker',
      apps: ['Job Boards', 'ATS'],
      uses: '8.9k',
      image: 'https://zapier.com/api/templates/v1/media/file/74caf2b80343a6e87d38729743956251-Thumbnail_7.webp',
    },
  ];

  const templateFilters = ['For you', 'AI Workflows', 'Most popular'];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a]">
      {/* Hero Section with Image */}
      <div className="relative w-full">
        <div className="relative h-[400px] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1617957718614-8c23f060c2d0?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="ORvexia Automation"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.className = 'relative h-[400px] bg-gradient-to-br from-orange-500 to-purple-600 overflow-hidden';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center px-4 max-w-4xl">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight"
              >
                <span className="block">What would you like</span>
                <span className="block">to automate?</span>
              </motion.h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-12">
        {/* AI Copilot Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative -mt-24 z-10"
        >
          <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-2xl shadow-xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Copilot</span>
              <span className="px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs font-medium rounded">
                AI beta
              </span>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter an idea or app name to get started"
                className="w-full px-6 py-4 pr-24 bg-gray-50 dark:bg-[#0d0d0d] border border-gray-200 dark:border-[#2a2a2a] rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all hover:border-orange-300 dark:hover:border-orange-700"
              />
              <div className="absolute right-4 bottom-4 flex items-center gap-2">
                <button className="p-2 hover:bg-gray-200 dark:hover:bg-[#2a2a2a] rounded-lg transition">
                  <Mic className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
                <button className="p-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition">
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-4">
              {['For you', 'Lead management', 'Customer support', 'Marketing & growth'].map((category) => (
                <button
                  key={category}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/20 rounded-lg transition"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Start from Scratch Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {startFromScratch.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
                onClick={() => item.path && navigate(item.path)}
                className={`group bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-xl p-6 hover:shadow-lg hover:border-orange-300 dark:hover:border-orange-700 transition-all hover-lift ${item.path ? 'cursor-pointer' : 'cursor-default'}`}
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition">
                  {item.label}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recommended Templates Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Recommended templates
            </h2>
            <button
              onClick={() => navigate('/templates')}
              className="text-sm font-medium text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition"
            >
              Browse all templates →
            </button>
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center gap-2 mb-6">
            {templateFilters.map((filter, idx) => (
              <button
                key={idx}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                  idx === 0
                    ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                    : 'bg-gray-100 dark:bg-[#1a1a1a] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#2a2a2a]'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Template Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {recommendedTemplates.map((template, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
              onClick={() => navigate('/templates')}
              className="group cursor-pointer bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-xl overflow-hidden hover:shadow-lg hover:border-orange-300 dark:hover:border-orange-700 transition-all card-hover"
              >
                <div className="h-40 bg-gray-100 dark:bg-[#222222] relative overflow-hidden">
                  <img
                    src={template.image}
                    alt={template.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.className = 'h-40 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/10 relative overflow-hidden flex items-center justify-center';
                    }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition line-clamp-2 mb-2">
                    {template.title}
                  </h3>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    {template.apps.map((app, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-gray-100 dark:bg-[#222222] text-gray-700 dark:text-gray-300 text-xs rounded"
                      >
                        {app}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <Users className="w-3 h-3" />
                    <span>{template.uses} uses</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-gray-200 dark:border-[#2a2a2a]">
          {[
            { label: 'Active Workflows', value: '48', icon: Workflow },
            { label: 'Executions Today', value: '1,247', icon: Play },
            { label: 'Success Rate', value: '99.9%', icon: CheckCircle2 },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + idx * 0.1 }}
              className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-orange-50 dark:bg-orange-950/30 rounded-lg flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-orange-600 dark:text-orange-500" />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </p>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
