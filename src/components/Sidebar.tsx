import React, { useState } from 'react';
import { LayoutDashboard, CheckSquare, LogOut, Code, Menu, X, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { authService } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from '../types';

interface SidebarProps {
  user: User | null;
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  user, 
  searchTerm, 
  setSearchTerm,
  isCollapsed,
  setIsCollapsed 
}) => {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: CheckSquare, label: 'Minhas Tarefas', path: '/tasks' },
  ];

  const NavContent = () => (
    <div className="flex h-full flex-col p-4">
      {/* Perfil do Usuário no Topo */}
      <div className={`mb-8 flex items-center gap-3 p-2 rounded-2xl bg-white/5 border border-white/5 ${isCollapsed && !isMobileOpen ? 'justify-center' : ''}`}>
        <img
          src={user?.avatar}
          alt="Avatar"
          className="h-10 w-10 rounded-xl border border-primary/20 shadow-glow-sm"
        />
        {(!isCollapsed || isMobileOpen) && (
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">{user?.name || 'Usuário'}</p>
            <p className="text-[10px] text-gray-500 truncate">{user?.email}</p>
          </div>
        )}
      </div>

      {/* Título do App */}
      <div className={`mb-8 flex items-center gap-3 px-2 ${isCollapsed && !isMobileOpen ? 'justify-center' : ''}`}>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-glow shrink-0">
          <Code className="text-white" size={18} />
        </div>
        {(!isCollapsed || isMobileOpen) && (
          <h1 className="text-lg font-bold glow-purple whitespace-nowrap">Taskify</h1>
        )}
      </div>

      {/* Busca dentro da Sidebar */}
      {(!isCollapsed || isMobileOpen) && (
        <div className="relative mb-6 px-2">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquisar..."
            className="w-full bg-background border border-white/5 rounded-xl py-2 pl-9 pr-3 text-xs focus:border-primary/50 outline-none transition-all"
          />
        </div>
      )}

      {/* Links de Navegação */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${
                isActive 
                  ? 'bg-primary/20 text-primary-light shadow-glow-sm border border-primary/20' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              } ${isCollapsed && !isMobileOpen ? 'justify-center px-0' : ''}`}
              title={item.label}
            >
              <Icon size={20} />
              {(!isCollapsed || isMobileOpen) && <span className="font-medium text-sm">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Logout e Colapso (Desktop) */}
      <div className="mt-auto space-y-2">
        <button
          onClick={() => authService.logout()}
          className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-gray-400 transition-all hover:bg-red-500/10 hover:text-red-400 group ${isCollapsed && !isMobileOpen ? 'justify-center px-0' : ''}`}
        >
          <LogOut size={20} />
          {(!isCollapsed || isMobileOpen) && <span className="font-medium text-sm">Sair</span>}
        </button>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex w-full items-center gap-3 rounded-xl px-4 py-3 text-gray-500 hover:text-white hover:bg-white/5 transition-all justify-start"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Botão Hambúrguer Mobile */}
      <button 
        onClick={() => setIsMobileOpen(true)}
        className="fixed top-6 left-6 z-[60] lg:hidden p-3 bg-surface border border-white/10 rounded-2xl text-primary-light shadow-glow-sm"
      >
        <Menu size={24} />
      </button>

      {/* Sidebar Desktop */}
      <aside className={`hidden lg:block fixed left-0 top-0 h-screen border-r border-white/5 bg-surface/20 backdrop-blur-xl z-50 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
        <NavContent />
      </aside>

      {/* Sidebar Mobile (Overlay) */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[70] lg:hidden"
            />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-screen w-72 bg-surface border-r border-white/10 z-[80] lg:hidden shadow-2xl"
            >
              <button 
                onClick={() => setIsMobileOpen(false)}
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
