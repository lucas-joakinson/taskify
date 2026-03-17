import React, { useEffect, useState } from 'react';
import { taskService } from '../services/api';
import { Task } from '../types';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import { Plus, Filter, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchTasks = async () => {
    setLoading(true);
    const data = await taskService.getTasks();
    setTasks(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateTask = async (title: string, description: string) => {
    await taskService.createTask({ title, description, status: 'pending' });
    fetchTasks();
  };

  const handleToggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    await taskService.updateTask(id, { status: newStatus });
    
    // Atualização otimista na UI
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  const handleDeleteTask = async (id: string) => {
    await taskService.deleteTask(id);
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = filter === 'all' || task.status === filter;
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold glow-purple">Minhas Tarefas</h2>
          <p className="text-gray-400 mt-1">Gerencie seu fluxo de trabalho diário.</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          Nova Tarefa
        </button>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4 bg-surface/30 p-4 rounded-2xl border border-white/5">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Filtrar por título..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field w-full pl-10"
          />
        </div>
        <div className="flex items-center gap-2 p-1 bg-background rounded-xl border border-white/5">
          {(['all', 'pending', 'completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                filter === f 
                  ? 'bg-primary text-white shadow-glow-sm' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {f === 'all' ? 'Todas' : f === 'pending' ? 'Pendentes' : 'Concluídas'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="h-10 w-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <p className="text-gray-400 animate-pulse">Carregando suas tarefas...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={handleToggleTask}
                onDelete={handleDeleteTask}
              />
            ))}
          </AnimatePresence>
          
          {filteredTasks.length === 0 && (
            <div className="col-span-full py-20 text-center">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-white/5 text-gray-600 mb-4">
                <Filter size={40} />
              </div>
              <h3 className="text-xl font-semibold text-gray-400">Nenhuma tarefa encontrada</h3>
              <p className="text-gray-500 mt-2">Tente ajustar seus filtros ou criar uma nova tarefa.</p>
            </div>
          )}
        </div>
      )}

      <TaskForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreateTask}
      />
    </div>
  );
};

export default TasksPage;
