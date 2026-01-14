import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check, Star, Zap, Globe, Shield, BarChart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { features, testimonials, pricingPlans } from '../utils/mockdata';

export const Landing = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleDemoLogin = async () => {
    // Auto-login as demo user for testing
    await login('demo@orvexia.com', 'demo123');
    navigate('/home');
  };

  const handleGetStarted = async () => {
    // Auto-login and redirect to home
    await login('demo@orvexia.com', 'demo123');
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a]">

      {/* Navbar */}
      <nav className="border-b border-gray-200 dark:border-[#1a1a1a] bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              ORvexia
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              Login
            </button>
            <button
              onClick={handleGetStarted}
              className="px-5 py-2 bg-orange-500 text-white text-sm font-semibold rounded-lg hover:bg-orange-600 transition"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero - Clean Background */}
      <section className="pt-20 pb-24 px-6 bg-white dark:bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
            Automate workflows with AI
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
            Connect your apps and automate workflows without code. Build intelligent automation that adapts and self-heals.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleGetStarted}
              className="px-8 py-4 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition flex items-center justify-center gap-2"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 border border-gray-300 dark:border-[#2a2a2a] text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition"
            >
              Login
            </button>
          </div>

          <p className="mt-6 text-sm text-gray-500">
            No credit card required • Free 14-day trial
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-[#fafafa] dark:bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Everything you need to automate
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Powerful features that make automation simple
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Zap, title: 'Visual Builder', desc: 'Drag-and-drop workflow editor' },
              { icon: Globe, title: 'Integrations', desc: 'Connect 500+ apps and services' },
              { icon: Shield, title: 'Self-Healing', desc: 'Auto-fix errors with AI' },
              { icon: BarChart, title: 'Analytics', desc: 'Track performance in real-time' }
            ].map((feature, i) => (
              <div key={i} className="bg-white dark:bg-[#0d0d0d] border border-gray-200 dark:border-[#1a1a1a] rounded-lg p-6">
                <feature.icon className="w-8 h-8 text-orange-500 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Trusted by teams worldwide
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-[#fafafa] dark:bg-[#0d0d0d] border border-gray-200 dark:border-[#1a1a1a] rounded-lg p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-orange-500 text-orange-500" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  "{t.quote}"
                </p>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{t.author}</p>
                  <p className="text-sm text-gray-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6 bg-[#fafafa] dark:bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Choose the plan that fits your needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, i) => (
              <div
                key={i}
                className={`bg-white dark:bg-[#0d0d0d] border ${
                  i === 1 
                    ? 'border-orange-500 shadow-lg' 
                    : 'border-gray-200 dark:border-[#1a1a1a]'
                } rounded-lg p-8`}
              >
                {i === 1 && (
                  <span className="inline-block px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full mb-4">
                    Most Popular
                  </span>
                )}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
                  {plan.description}
                </p>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    {plan.price}
                  </span>
                  {plan.price !== 'Custom' && (
                    <span className="text-gray-500">/month</span>
                  )}
                </div>

                <button
                  className={`w-full py-3 rounded-lg font-semibold mb-6 ${
                    i === 1
                      ? 'bg-orange-500 text-white hover:bg-orange-600'
                      : 'border border-gray-300 dark:border-[#2a2a2a] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1a1a1a]'
                  } transition`}
                >
                  Get Started
                </button>

                <ul className="space-y-3">
                  {plan.features.map((f, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <Check className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 dark:text-gray-300">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-white dark:bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Ready to automate your workflow?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-10">
            Join thousands of teams using ORvexia to save time and reduce errors.
          </p>
          <button
            onClick={handleGetStarted}
            className="px-8 py-4 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition inline-flex items-center gap-2"
          >
            Get Started
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-[#1a1a1a] py-12 px-6 bg-[#fafafa] dark:bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  ORvexia
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                AI-native workflow automation for modern teams.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">Integrations</a></li>
                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">Security</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">Documentation</a></li>
                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">API Reference</a></li>
                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">Tutorials</a></li>
                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">Blog</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">Legal</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-200 dark:border-[#1a1a1a] text-center text-sm text-gray-600 dark:text-gray-400">
            © 2026 ORvexia. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};