import React, { useState } from 'react';
import { Task, TaskStatus } from '../types';
import TaskCard from './TaskCard';
import DropIndicator from './DropIndicator';
import { Plus, MoreHorizontal } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

interface ColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onAddTask: (status: TaskStatus) => void;
  onDeleteTask: (id: string) => void;
  onMoveTask: (id: string, newStatus: TaskStatus, index?: number) => void;
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
  const [active, setActive] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setActive(true);
    highlightIndicator(e);
  };

  const highlightIndicator = (e: React.DragEvent) => {
    const indicators = getIndicators();
    clearHighlights(indicators);
    const el = getNearestIndicator(e, indicators);
    el.element.style.opacity = "1";
  };

  const clearHighlights = (els?: HTMLElement[]) => {
    const indicators = els || getIndicators();
    indicators.forEach((i) => {
      i.style.opacity = "0";
    });
  };

  const getNearestIndicator = (e: React.DragEvent, indicators: HTMLElement[]) => {
    const DISTANCE_OFFSET = 50;
    const el = indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = e.clientY - (box.top + DISTANCE_OFFSET);
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1],
      }
    );
    return el;
  };

  const getIndicators = () => {
    return Array.from(document.querySelectorAll(`[data-status="${status}"]`)) as HTMLElement[];
  };

  const handleDragLeave = () => {
    setActive(false);
    clearHighlights();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setActive(false);
    clearHighlights();
    
    const taskId = e.dataTransfer.getData('taskId');
    const indicators = getIndicators();
    const { element } = getNearestIndicator(e, indicators);
    
    const beforeId = element.dataset.before || "-1";
    
    if (beforeId !== taskId) {
      let targetIndex = tasks.findIndex(t => t.id === beforeId);
      if (targetIndex === -1) targetIndex = tasks.length;
      
      onMoveTask(taskId, status, targetIndex);
    }
  };

  return (
    <div 
      className={`flex flex-col w-full min-w-[300px] max-w-[350px] h-full rounded-2xl border transition-colors duration-300 backdrop-blur-sm overflow-hidden ${
        active ? 'bg-primary/5 border-primary/30 shadow-glow-sm' : 'bg-surface/10 border-white/5'
      }`}
    >
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

      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar min-h-[500px]"
      >
        <AnimatePresence mode="popLayout">
          {tasks.map((task) => (
            <React.Fragment key={task.id}>
              <DropIndicator beforeId={task.id} status={status} />
              <TaskCard
                task={task}
                onDelete={onDeleteTask}
                onMove={onMoveTask}
                onClick={() => onSelectTask(task)}
              />
            </React.Fragment>
          ))}
        </AnimatePresence>
        
        <DropIndicator beforeId={null} status={status} />

        {tasks.length === 0 && !active && (
          <div className="py-10 flex flex-col items-center justify-center text-center opacity-50 border-2 border-dashed border-white/5 rounded-2xl">
            <p className="text-xs text-gray-500 font-medium">Sem tarefas</p>
          </div>
        )}

        <button
          onClick={() => onAddTask(status)}
          className="w-full mt-4 py-3 flex items-center justify-center gap-2 rounded-xl border border-dashed border-white/10 text-gray-500 hover:text-primary-light hover:border-primary/30 hover:bg-primary/5 transition-all group"
        >
          <Plus size={16} className="group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold uppercase tracking-tighter">Adicionar tarefa</span>
        </button>
      </div>
    </div>
  );
};

export default Column;
