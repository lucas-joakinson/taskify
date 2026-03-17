import React from 'react';
import { User } from '../types';
import { Bell, Search } from 'lucide-react';

interface HeaderProps {
  user: User | null;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  return (
    <header className="fixed right-0 top-0 z-40 h-20 w-full lg:w-[calc(100%-16rem)] border-b border-white/5 bg-background/50 backdrop-blur-md px-4 lg:px-8">
      <div className="flex h-full items-center justify-between">
        {/* Espaço reservado para o botão mobile na esquerda */}
        <div className="flex items-center gap-4 lg:gap-0">
          <div className="w-12 lg:hidden shrink-0"></div> 
          
          <div className="relative hidden sm:block w-48 md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input
              type="text"
              placeholder="Buscar tarefas..."
              className="w-full bg-surface/50 border border-white/5 rounded-xl py-2 pl-9 pr-4 text-xs lg:text-sm focus:border-primary/50 outline-none transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 lg:gap-6">
          <button className="relative text-gray-400 hover:text-white transition-colors p-2">
            <Bell size={18} />
            <span className="absolute right-2 top-2 flex h-1.5 w-1.5 rounded-full bg-primary shadow-glow"></span>
          </button>
          
          <div className="h-6 w-px bg-white/10 hidden lg:block"></div>
          
          <div className="flex items-center gap-2 lg:gap-3">
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
