import { motion } from 'framer-motion';
import { Workflow, Clock, CheckCircle2, Play, ArrowRight, Plus } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { chartData, executions } from '../utils/mockData';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const navigate = useNavigate();

  const metrics = [
    { title: 'Total Workflows', value: '48', icon: Workflow, change: '+12%' },
    { title: 'Executions Today', value: '1,247', icon: Play, change: '+23%' },
    { title: 'Avg Response Time', value: '142ms', icon: Clock, change: '-15%' },
    { title: 'Success Rate', value: '99.9%', icon: CheckCircle2, change: '+2%' },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Overview of your workflow performance
          </p>
        </div>
        <button
          onClick={() => navigate('/workflows/builder')}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition"
        >
          <Plus className="w-4 h-4" />
          New Workflow
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.1 }}
          >
            <div className="bg-white dark:bg-[#0d0d0d] border border-gray-200 dark:border-[#1a1a1a] rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-orange-50 dark:bg-orange-950/30 rounded-lg flex items-center justify-center">
                  <metric.icon className="w-5 h-5 text-orange-600 dark:text-orange-500" />
                </div>
                <span className="text-sm font-medium text-green-600 dark:text-green-500">
                  {metric.change}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {metric.title}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {metric.value}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-[#0d0d0d] border border-gray-200 dark:border-[#1a1a1a] rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Execution Trends
            </h3>
            <select className="px-3 py-1.5 border border-gray-200 dark:border-[#1a1a1a] bg-white dark:bg-[#0d0d0d] rounded-lg text-sm text-gray-700 dark:text-gray-300">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData.executionsOverTime}>
              <defs>
                <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-[#1a1a1a]" />
              <XAxis 
                dataKey="date" 
                stroke="#9ca3af" 
                style={{ fontSize: '12px' }}
                tick={{ fill: '#9ca3af' }}
              />
              <YAxis 
                stroke="#9ca3af" 
                style={{ fontSize: '12px' }}
                tick={{ fill: '#9ca3af' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                labelStyle={{ color: '#374151' }}
              />
              <Area
                type="monotone"
                dataKey="success"
                stroke="#f97316"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorSuccess)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Activity Feed */}
        <div className="bg-white dark:bg-[#0d0d0d] border border-gray-200 dark:border-[#1a1a1a] rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h3>
          <div className="space-y-4">
            {executions.slice(0, 6).map((ex) => (
              <div
                key={ex.id}
                className="flex items-start gap-3 pb-4 border-b border-gray-100 dark:border-[#1a1a1a] last:border-0 last:pb-0"
              >
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                  ex.status === 'completed' ? 'bg-green-500' : 'bg-red-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {ex.workflowName}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{ex.timestamp}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
              </div>
            ))}
          </div>
          <button className="w-full mt-4 px-4 py-2 text-sm font-medium text-orange-600 dark:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/20 rounded-lg transition">
            View All Activity
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        {[
          { label: 'Time Saved Today', value: '4.2 hours' },
          { label: 'Active Integrations', value: '12 services' },
          { label: 'Workflows Created', value: '48 total' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-[#0d0d0d] border border-gray-200 dark:border-[#1a1a1a] rounded-lg p-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              {stat.label}
            </p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};