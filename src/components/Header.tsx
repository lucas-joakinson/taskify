import React from 'react';
import { User } from '../types';
import { Bell, Search } from 'lucide-react';

interface HeaderProps {
  user: User | null;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  return (
    <header className="fixed right-0 top-0 z-40 h-20 w-[calc(100%-16rem)] border-b border-white/5 bg-background/50 backdrop-blur-md px-8">
      <div className="flex h-full items-center justify-between">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar tarefas..."
            className="w-full bg-surface/50 border border-white/5 rounded-xl py-2 pl-10 pr-4 text-sm focus:border-primary/50 outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-6">
          <button className="relative text-gray-400 hover:text-white transition-colors">
            <Bell size={20} />
            <span className="absolute -right-0.5 -top-0.5 flex h-2 w-2 rounded-full bg-primary shadow-glow"></span>
          </button>
          
          <div className="h-8 w-px bg-white/10"></div>
          
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold text-white">{user?.name || 'Usuário'}</p>
              <p className="text-xs text-gray-400">{user?.email}</p>
            </div>
            <img
              src={user?.avatar}
              alt="Avatar"
              className="h-10 w-10 rounded-xl border border-primary/20 p-0.5"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
