import React from 'react';
import { Task } from '../types';
import { Trash2, CheckCircle2, Clock, MoreVertical } from 'lucide-react';
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
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`glass-card p-5 group relative overflow-hidden transition-all duration-300 ${
        isCompleted ? 'border-primary/10 opacity-70' : 'hover:border-primary/40'
      }`}
    >
      {/* Efeito de Glow */}
      <div className={`absolute -right-4 -top-4 h-24 w-24 rounded-full blur-3xl transition-all duration-500 ${
        isCompleted ? 'bg-primary/5' : 'bg-primary/20 opacity-0 group-hover:opacity-100'
      }`}></div>

      <div className="flex items-start justify-between relative z-10">
        <div className="flex-1">
          <h3 className={`font-semibold text-lg transition-all ${
            isCompleted ? 'text-gray-500 line-through' : 'text-white'
          }`}>
            {task.title}
          </h3>
          <p className="text-gray-400 text-sm mt-1 line-clamp-2">
            {task.description}
          </p>
          
          <div className="flex items-center gap-3 mt-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {new Date(task.createdAt).toLocaleDateString()}
            </span>
            <span className={`px-2 py-0.5 rounded-full border ${
              isCompleted 
                ? 'border-green-500/20 text-green-400 bg-green-500/5' 
                : 'border-primary/20 text-primary-light bg-primary/5'
            }`}>
              {isCompleted ? 'Concluída' : 'Pendente'}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2 ml-4">
          <button
            onClick={() => onToggle(task.id)}
            className={`p-2 rounded-lg transition-all ${
              isCompleted 
                ? 'bg-green-500/10 text-green-400' 
                : 'bg-white/5 text-gray-400 hover:text-primary-light hover:bg-primary/10'
            }`}
            title={isCompleted ? "Marcar como pendente" : "Marcar como concluída"}
          >
            <CheckCircle2 size={18} />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
            title="Excluir tarefa"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;
