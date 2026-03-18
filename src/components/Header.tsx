import React from 'react';
import { User } from '../types';
import { Bell, Search, X } from 'lucide-react';

interface HeaderProps {
  user: User | null;
  searchTerm: string;
  setSearchTerm: (val: string) => void;
}

const Header: React.FC<HeaderProps> = ({ user, searchTerm, setSearchTerm }) => {
  return (
    <header className="fixed right-0 top-0 z-[50] h-20 w-full lg:w-[calc(100%-16rem)] border-b border-white/5 bg-background/50 backdrop-blur-md px-4 lg:px-8">
      <div className="flex h-full items-center justify-between">
        <div className="flex items-center gap-4 lg:gap-0 flex-1 lg:flex-none">
          <div className="w-12 lg:hidden shrink-0"></div> 
          
          <div className="relative w-full sm:w-48 md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar tarefas em tempo real..."
              className="w-full bg-surface/50 border border-white/5 rounded-xl py-2 pl-9 pr-10 text-xs lg:text-sm focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none transition-all"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 lg:gap-6 ml-4">
          <button className="relative text-gray-400 hover:text-white transition-colors p-2 shrink-0">
            <Bell size={18} />
            <span className="absolute right-2 top-2 flex h-1.5 w-1.5 rounded-full bg-primary shadow-glow"></span>
          </button>
          
          <div className="h-6 w-px bg-white/10 hidden lg:block"></div>
          
          <div className="flex items-center gap-2 lg:gap-3 shrink-0">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-white leading-none">{user?.name || 'Usuário'}</p>
              <p className="text-[10px] lg:text-xs text-gray-400 mt-1">{user?.email}</p>
            </div>
            <img
              src={user?.avatar}
              alt="Avatar"
              className="h-8 w-8 lg:h-10 lg:w-10 rounded-xl border border-primary/20 p-0.5"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
