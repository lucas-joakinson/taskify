import React from 'react';
import { Task, TaskStatus } from '../types';
import { Trash2, Calendar, ChevronRight, ChevronLeft, MoreVertical } from 'lucide-react';
import { motion } from 'framer-motion';

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
  onMove: (id: string, newStatus: TaskStatus) => void;
  onClick: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onDelete, onMove, onClick }) => {
  const getNextStatus = (status: TaskStatus): TaskStatus | null => {
    if (status === 'todo') return 'in-progress';
    if (status === 'in-progress') return 'done';
    return null;
  };

  const getPrevStatus = (status: TaskStatus): TaskStatus | null => {
    if (status === 'done') return 'in-progress';
    if (status === 'in-progress') return 'todo';
    return null;
  };

  const nextStatus = getNextStatus(task.status);
  const prevStatus = getPrevStatus(task.status);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2, scale: 1.01 }}
      onClick={onClick}
      className="glass-card p-4 group relative overflow-hidden transition-all duration-300 cursor-pointer border-white/5 hover:border-primary/40 hover:shadow-glow bg-surface/20"
    >
      <div className="flex flex-col gap-3 relative z-10">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-sm text-white transition-all duration-300 line-clamp-2 group-hover:text-primary-light">
            {task.title}
          </h3>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
            className="p-1.5 rounded-lg bg-white/5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
            title="Excluir"
          >
            <Trash2 size={14} />
          </button>
        </div>
        
        {task.description && (
          <p className="text-xs text-gray-400 line-clamp-2 group-hover:text-gray-300 transition-colors">
            {task.description}
          </p>
        )}
        
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
            <Calendar size={12} />
            {new Date(task.createdAt).toLocaleDateString()}
          </div>

          <div className="flex items-center gap-1">
            {prevStatus && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMove(task.id, prevStatus);
                }}
                className="p-1 rounded-md bg-white/5 text-gray-400 hover:text-primary-light hover:bg-primary/10 transition-all"
                title={`Mover para ${prevStatus}`}
              >
                <ChevronLeft size={14} />
              </button>
            )}
            {nextStatus && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMove(task.id, nextStatus);
                }}
                className="p-1 rounded-md bg-white/5 text-gray-400 hover:text-primary-light hover:bg-primary/10 transition-all"
                title={`Mover para ${nextStatus}`}
              >
                <ChevronRight size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className={`absolute left-0 top-0 h-full w-[3px] transition-all duration-500 ${
        task.status === 'done' ? 'bg-green-500/50' : 
        task.status === 'in-progress' ? 'bg-blue-500/50' : 'bg-primary/50'
      }`}></div>
    </motion.div>
  );
};

export default TaskCard;
