import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

/* =======================
   TEMPLATE DATA (PNG/JPG ONLY — NO SVG)
======================= */

const templates = [
  {
    id: 1,
    title: 'AI Agent Automation Flow',
    description: 'Trigger → AI Agent → Tool → Output',
    tags: ['AI', 'Workflow', 'Automation'],
    image:
      'https://miro.medium.com/v2/resize:fit:1400/1*eGmYz5R6kLZ3xJkq5Zq5YQ.png',
    date: 'Feb 20, 2024',
    readTime: '12 min',
  },
  {
    id: 2,
    title: 'API Orchestration Workflow',
    description: 'Webhook → API Call → Transform → Response',
    tags: ['API', 'Integration'],
    image:
      'https://miro.medium.com/v2/resize:fit:1400/1*9h9xXyF6dQwE5x7pX0h3yA.png',
    date: 'Feb 18, 2024',
    readTime: '10 min',
  },
  {
    id: 3,
    title: 'Voiceflow-Style Conversational Flow',
    description: 'Intent → Decision → Response',
    tags: ['Voice', 'Chatbot', 'LLM'],
    image:
      'https://uploads-ssl.webflow.com/62c5c7e50e6c7f3b53e5c0b3/63a41bb2df5cfb2d14f4f3c7_voiceflow-canvas.png',
    date: 'Feb 15, 2024',
    readTime: '14 min',
  },
  {
    id: 4,
    title: 'Auto Layout Workflow',
    description: 'Automatically arranged nodes and connections',
    tags: ['Auto-Layout', 'Graph'],
    image:
      'https://raw.githubusercontent.com/xyflow/xyflow/main/examples/assets/auto-layout.png',
    date: 'Feb 12, 2024',
    readTime: '11 min',
  },
  {
    id: 5,
    title: 'Business Process Automation (BPMN)',
    description: 'Approval → Condition → Execution',
    tags: ['BPM', 'Enterprise'],
    image:
      'https://camunda.com/wp-content/uploads/2022/03/bpmn-diagram-example.png',
    date: 'Feb 10, 2024',
    readTime: '15 min',
  },
  {
    id: 6,
    title: 'Integration Flow Builder',
    description: 'Source → Mapping → Destination',
    tags: ['Integration', 'Data'],
    image:
      'https://www.ibm.com/docs/en/SS9H2Y_7.6.0/com.ibm.websphere.integrator.doc/images/flow-editor.png',
    date: 'Feb 8, 2024',
    readTime: '9 min',
  },
];

/* =======================
   COMPONENT
======================= */

export const Templates = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-7xl mx-auto px-6 py-14">

        <header className="mb-14">
          <h1 className="text-4xl font-bold mb-3">Workflow Templates</h1>
          <p className="text-gray-400 max-w-2xl">
            Real workflow diagrams inspired by modern automation and flow builders.
          </p>
        </header>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((item, idx) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="group cursor-pointer"
            >
              <div className="rounded-xl overflow-hidden border border-white/10 bg-[#0d0d0d] hover:border-orange-500 transition">

                {/* IMAGE (NOW WILL SHOW) */}
                <div className="h-44 bg-black flex items-center justify-center">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map(tag => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 rounded bg-white/10 text-gray-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h3 className="text-lg font-semibold group-hover:text-orange-500 transition">
                    {item.title}
                  </h3>

                  <p className="text-sm text-gray-400">
                    {item.description}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-gray-500 pt-2">
                    <Clock className="w-3 h-3" />
                    <span>{item.date}</span>
                    <span>•</span>
                    <span>{item.readTime}</span>
                  </div>
                </div>

              </div>
            </motion.article>
          ))}
        </div>

      </div>
    </div>
  );
};