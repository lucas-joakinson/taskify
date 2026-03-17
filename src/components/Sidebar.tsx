import React, { useState } from 'react';
import { LayoutDashboard, CheckSquare, LogOut, Code, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { authService } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: CheckSquare, label: 'Minhas Tarefas', path: '/tasks' },
  ];

  const NavContent = () => (
    <div className="flex h-full flex-col p-6">
      <div className="mb-10 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-glow shrink-0">
          <Code className="text-white" size={24} />
        </div>
        <h1 className="text-xl font-bold glow-purple whitespace-nowrap">Taskify <span className="text-primary-light">SaaS</span></h1>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${
                isActive 
                  ? 'bg-primary/20 text-primary-light shadow-glow-sm border border-primary/20' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <button
        onClick={() => authService.logout()}
        className="mt-auto flex items-center gap-3 rounded-xl px-4 py-3 text-gray-400 transition-all hover:bg-red-500/10 hover:text-red-400 group"
      >
        <LogOut size={20} className="group-hover:rotate-180 transition-transform duration-300" />
        <span className="font-medium">Sair</span>
      </button>
    </div>
  );

  return (
    <>
      {/* Botão de Menu para Mobile */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed top-6 left-6 z-[60] lg:hidden p-2 bg-surface border border-white/10 rounded-xl text-primary-light shadow-glow-sm"
      >
        <Menu size={24} />
      </button>

      {/* Sidebar para Desktop */}
      <aside className="hidden lg:block fixed left-0 top-0 h-screen w-64 border-r border-white/5 bg-surface/20 backdrop-blur-xl z-50">
        <NavContent />
      </aside>

      {/* Sidebar para Mobile (Overlay) */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[70] lg:hidden"
            />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-screen w-72 bg-surface border-r border-white/10 z-[80] lg:hidden"
            >
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 p-2 text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
              <NavContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
