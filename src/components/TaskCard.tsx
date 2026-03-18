import React from 'react';
import { Task } from '../types';
import { Trash2, CheckCircle2, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onToggle, onDelete }) => {
  const isCompleted = task.status === 'completed';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className={`glass-card p-5 group relative overflow-hidden transition-all duration-500 cursor-pointer ${
        isCompleted 
          ? 'border-primary/5 bg-surface/10 opacity-60' 
          : 'hover:border-primary/40 hover:shadow-glow hover:bg-surface/40'
      }`}
    >
      <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full blur-[50px] transition-all duration-700 pointer-events-none ${
        isCompleted ? 'bg-primary/5' : 'bg-primary/20 opacity-0 group-hover:opacity-100'
      }`}></div>

      <div className="flex items-start justify-between relative z-10">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className={`font-bold text-lg transition-all duration-500 truncate ${
              isCompleted ? 'text-gray-500 line-through' : 'text-white'
            }`}>
              {task.title}
            </h3>
          </div>
          
          <p className={`text-sm mb-4 line-clamp-2 transition-colors duration-500 ${
            isCompleted ? 'text-gray-600' : 'text-gray-400'
          }`}>
            {task.description || "Sem descrição disponível."}
          </p>
          
          <div className="flex flex-wrap items-center gap-3 text-[10px] lg:text-xs">
            <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 text-gray-500 border border-white/5">
              <Calendar size={12} />
              {new Date(task.createdAt).toLocaleDateString()}
            </span>
            <span className={`px-2 py-1 rounded-md border font-bold uppercase tracking-wider ${
              isCompleted 
                ? 'border-green-500/20 text-green-500 bg-green-500/5' 
                : 'border-primary/30 text-primary-light bg-primary/10'
            }`}>
              {isCompleted ? 'Concluída' : 'Em Aberto'}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2 ml-4 shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle(task.id);
            }}
            className={`p-2.5 rounded-xl transition-all duration-300 ${
              isCompleted 
                ? 'bg-green-500 text-white shadow-glow-sm' 
                : 'bg-surface border border-white/5 text-gray-500 hover:text-primary-light hover:border-primary/50'
            }`}
            title={isCompleted ? "Reabrir tarefa" : "Concluir tarefa"}
          >
            <CheckCircle2 size={18} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
            className="p-2.5 rounded-xl bg-surface border border-white/5 text-gray-500 hover:text-red-400 hover:border-red-500/50 transition-all duration-300"
            title="Excluir"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      
      {!isCompleted && (
        <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-700"></div>
      )}
    </motion.div>
  );
};

export default TaskCard;
