import React, { useEffect, useState, useMemo } from 'react';
import { taskService } from '../services/api';
import { Task } from '../types';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import SkeletonTask from '../components/SkeletonTask';
import Toast, { ToastType } from '../components/Toast';
import { Plus, Filter, Search, RefreshCw, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Toast State
  const [toast, setToast] = useState<{ message: string; type: ToastType; isVisible: boolean }>({
    message: '', type: 'success', isVisible: false
  });

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({ message, type, isVisible: true });
  };

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await taskService.getTasks();
      setTasks(data);
    } catch (err: any) {
      setError(err.message);
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateTask = async (title: string, description: string) => {
    try {
      const newTask = await taskService.createTask({ title, description, status: 'pending' });
      setTasks(prev => [newTask, ...prev]);
      showToast("Tarefa criada com sucesso!");
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleToggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    
    // UI Otimista
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));

    try {
      await taskService.updateTask(id, { status: newStatus });
      showToast(`Tarefa marcada como ${newStatus === 'completed' ? 'concluída' : 'pendente'}`);
    } catch (err: any) {
      // Reverter se der erro
      setTasks(prev => prev.map(t => t.id === id ? { ...t, status: task.status } : t));
      showToast(err.message, 'error');
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja excluir esta tarefa?")) return;

    try {
      await taskService.deleteTask(id);
      setTasks(prev => prev.filter(t => t.id !== id));
      showToast("Tarefa excluída com sucesso!");
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesFilter = filter === 'all' || task.status === filter;
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           task.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [tasks, filter, searchTerm]);

  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in duration-500 pb-10 px-2 sm:px-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-16 lg:mt-0">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold glow-purple">Minhas Tarefas</h2>
          <p className="text-gray-400 mt-1">Gerencie seu fluxo de trabalho diário.</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto px-6"
        >
          <Plus size={20} />
          Nova Tarefa
        </button>
      </div>

      {/* Toolbar: Busca e Filtros */}
      <div className="flex flex-col lg:flex-row items-center gap-4 bg-surface/30 p-3 lg:p-4 rounded-2xl border border-white/5">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Filtrar por título ou descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field w-full pl-10 h-11"
          />
        </div>
        
        <div className="flex items-center gap-1 p-1 bg-background rounded-xl border border-white/5 w-full lg:w-auto overflow-x-auto no-scrollbar">
          {(['all', 'pending', 'completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 lg:flex-none whitespace-nowrap px-4 py-2 rounded-lg text-xs lg:text-sm font-medium transition-all duration-300 ${
                filter === f 
                  ? 'bg-primary text-white shadow-glow border border-primary/20 scale-[1.02]' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {f === 'all' ? 'Todas' : f === 'pending' ? 'Pendentes' : 'Concluídas'}
            </button>
          ))}
        </div>
      </div>

      {/* Estados de UI */}
      {error && !loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-red-500/5 rounded-3xl border border-red-500/10">
          <AlertCircle className="text-red-500 mb-4" size={48} />
          <h3 className="text-xl font-bold text-white mb-2">Ops! Algo deu errado</h3>
          <p className="text-gray-400 mb-6 max-w-xs text-center">{error}</p>
          <button onClick={fetchTasks} className="btn-primary flex items-center gap-2">
            <RefreshCw size={18} /> Tentar Novamente
          </button>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => <SkeletonTask key={i} />)}
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
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="col-span-full py-24 text-center glass-card border-dashed border-white/5"
            >
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-white/5 text-gray-600 mb-4">
                <Filter size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-400">Nenhuma tarefa encontrada</h3>
              <p className="text-gray-500 mt-2">Tente ajustar seus filtros ou buscar por outros termos.</p>
            </motion.div>
          )}
        </div>
      )}

      <TaskForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreateTask}
      />

      <Toast 
        {...toast} 
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))} 
      />
    </div>
  );
};

export default TasksPage;
