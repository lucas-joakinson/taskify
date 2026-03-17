import React from 'react';
import { LayoutDashboard, CheckSquare, LogOut, Code } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { authService } from '../services/api';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: CheckSquare, label: 'Minhas Tarefas', path: '/tasks' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-white/5 bg-surface/20 backdrop-blur-xl z-50">
      <div className="flex h-full flex-col p-6">
        <div className="mb-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-glow">
            <Code className="text-white" size={24} />
          </div>
          <h1 className="text-xl font-bold glow-purple">Taskify <span className="text-primary-light">SaaS</span></h1>
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                to={item.path}
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
          className="mt-auto flex items-center gap-3 rounded-xl px-4 py-3 text-gray-400 transition-all hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut size={20} />
          <span className="font-medium">Sair</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
