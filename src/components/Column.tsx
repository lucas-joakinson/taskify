import React from 'react';
import { Task, TaskStatus } from '../types';
import TaskCard from './TaskCard';
import { Plus, MoreHorizontal } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

interface ColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onAddTask: (status: TaskStatus) => void;
  onDeleteTask: (id: string) => void;
  onMoveTask: (id: string, newStatus: TaskStatus) => void;
  onSelectTask: (task: Task) => void;
}

const Column: React.FC<ColumnProps> = ({ 
  title, 
  status, 
  tasks, 
  onAddTask, 
  onDeleteTask, 
  onMoveTask, 
  onSelectTask 
}) => {
  return (
    <div className="flex flex-col w-full min-w-[300px] max-w-[350px] h-full bg-surface/10 rounded-2xl border border-white/5 backdrop-blur-sm overflow-hidden">
      <div className="p-4 flex items-center justify-between border-b border-white/5 bg-white/5">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-sm text-white uppercase tracking-wider">{title}</h3>
          <span className="px-2 py-0.5 rounded-full bg-white/5 text-[10px] font-bold text-gray-400 border border-white/5">
            {tasks.length}
          </span>
        </div>
        <button className="p-1 text-gray-500 hover:text-white transition-colors">
          <MoreHorizontal size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar min-h-[500px]">
        <AnimatePresence mode="popLayout">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={onDeleteTask}
              onMove={onMoveTask}
              onClick={() => onSelectTask(task)}
            />
          ))}
        </AnimatePresence>

        {tasks.length === 0 && (
          <div className="py-10 flex flex-col items-center justify-center text-center opacity-50 border-2 border-dashed border-white/5 rounded-2xl">
            <p className="text-xs text-gray-500 font-medium">Sem tarefas</p>
          </div>
        )}

        <button
          onClick={() => onAddTask(status)}
          className="w-full py-3 flex items-center justify-center gap-2 rounded-xl border border-dashed border-white/10 text-gray-500 hover:text-primary-light hover:border-primary/30 hover:bg-primary/5 transition-all group"
        >
          <Plus size={16} className="group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold uppercase tracking-tighter">Adicionar tarefa</span>
        </button>
      </div>
    </div>
  );
};

export default Column;
