import React from 'react';
import { Task, TaskStatus } from '../types';
import Column from './Column';

interface KanbanBoardProps {
  tasks: Task[];
  onAddTask: (status: TaskStatus) => void;
  onDeleteTask: (id: string) => void;
  onMoveTask: (id: string, newStatus: TaskStatus) => void;
  onSelectTask: (task: Task) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ 
  tasks, 
  onAddTask, 
  onDeleteTask, 
  onMoveTask, 
  onSelectTask 
}) => {
  const columns: { title: string; status: TaskStatus }[] = [
    { title: 'A fazer', status: 'todo' },
    { title: 'Em progresso', status: 'in-progress' },
    { title: 'Feito', status: 'done' },
  ];

  return (
    <div className="flex gap-6 overflow-x-auto pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent h-full min-h-[600px]">
      {columns.map((column) => (
        <Column
          key={column.status}
          title={column.title}
          status={column.status}
          tasks={tasks.filter((t) => t.status === column.status)}
          onAddTask={onAddTask}
          onDeleteTask={onDeleteTask}
          onMoveTask={onMoveTask}
          onSelectTask={onSelectTask}
        />
      ))}
    </div>
  );
};

export default KanbanBoard;
