import React, { useState, useMemo } from 'react';
import { LayoutDashboard, Layout, Code, Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from '../types';
import ThemeToggle from './ThemeToggle';

interface SidebarProps {
  user: User | null;
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  user, 
  isCollapsed,
  setIsCollapsed 
}) => {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems = useMemo(() => [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Layout, label: 'Meu Quadro', path: '/tasks' },
  ], []);

  const NavContent = () => (
    <div className="flex h-full flex-col p-4">
      {/* Título do App */}
      <div className={`mb-8 flex items-center gap-3 px-2 ${isCollapsed && !isMobileOpen ? 'justify-center' : ''}`}>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-glow shrink-0">
          <Code className="text-white" size={18} />
        </div>
        {(!isCollapsed || isMobileOpen) && (
          <h1 className="text-lg font-bold glow-purple whitespace-nowrap text-foreground">Taskify</h1>
        )}
      </div>

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
                  ? 'bg-primary/20 text-primary shadow-glow-sm border border-primary/20' 
                  : 'text-slate-500 hover:bg-input hover:text-foreground'
              } ${isCollapsed && !isMobileOpen ? 'justify-center px-0' : ''}`}
              title={item.label}
            >
              <Icon size={20} />
              {(!isCollapsed || isMobileOpen) && <span className="font-medium text-sm">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer do Sidebar: Toggle e Colapso */}
      <div className="mt-auto space-y-4">
        <div className={`flex items-center gap-3 px-2 ${isCollapsed && !isMobileOpen ? 'justify-center' : 'justify-between'}`}>
          {(!isCollapsed || isMobileOpen) && (
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Tema</span>
          )}
          <ThemeToggle />
        </div>

        <div className={`flex gap-2 ${isCollapsed && !isMobileOpen ? 'flex-col items-center' : 'items-center flex-row'}`}>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`flex items-center justify-center rounded-xl p-3 text-slate-500 hover:text-foreground hover:bg-input transition-all ${isCollapsed ? 'w-full' : 'flex-1 border border-border/10 bg-input'}`}
            title={isCollapsed ? "Expandir" : "Recolher"}
          >
            {isCollapsed ? <ChevronRight size={20} /> : <div className="flex items-center gap-2"><ChevronLeft size={20} /><span className="text-sm font-medium">Recolher</span></div>}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button 
        onClick={() => setIsMobileOpen(true)}
        className="fixed top-6 left-6 z-[60] lg:hidden p-3 bg-surface border border-border/10 rounded-2xl text-primary shadow-glow-sm"
      >
        <Menu size={24} />
      </button>

      <aside className={`hidden lg:block fixed left-0 top-0 h-screen border-r border-border/10 bg-surface/20 backdrop-blur-xl z-50 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
        <NavContent />
      </aside>

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
              className="fixed left-0 top-0 h-screen w-72 bg-surface border-r border-border/10 z-[80] lg:hidden shadow-2xl"
            >
              <button 
                onClick={() => setIsMobileOpen(false)}
                className="absolute top-6 right-6 p-2 text-slate-500 hover:text-foreground"
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
