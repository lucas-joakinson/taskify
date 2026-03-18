import React, { useEffect, useState, useMemo } from 'react';
import { taskService } from '../services/api';
import { Task } from '../types';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import SkeletonTask from '../components/SkeletonTask';
import Toast, { ToastType } from '../components/Toast';
import Modal from '../components/Modal';
import { Plus, Filter, Search, RefreshCw, AlertCircle, Trash2, CheckCircle2, Calendar, FileText, Edit3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TasksPageProps {
  globalSearchTerm?: string;
}

const TasksPage: React.FC<TasksPageProps> = ({ globalSearchTerm = '' }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

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

  const handleSubmitTask = async (title: string, description: string) => {
    try {
      if (taskToEdit) {
        // Modo Edição
        const updated = await taskService.updateTask(taskToEdit.id, { title, description });
        setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
        if (selectedTask?.id === updated.id) setSelectedTask(updated);
        showToast("Tarefa atualizada com sucesso!");
      } else {
        // Modo Criação
        const newTask = await taskService.createTask({ title, description, status: 'pending' });
        setTasks(prev => [newTask, ...prev]);
        showToast("Tarefa criada com sucesso!");
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setTaskToEdit(null);
    }
  };

  const handleToggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
    if (selectedTask?.id === id) {
      setSelectedTask(prev => prev ? { ...prev, status: newStatus } : null);
    }

    try {
      await taskService.updateTask(id, { status: newStatus });
      showToast(`Tarefa marcada como ${newStatus === 'completed' ? 'concluída' : 'pendente'}`);
    } catch (err: any) {
      setTasks(prev => prev.map(t => t.id === id ? { ...t, status: task.status } : t));
      showToast(err.message, 'error');
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja excluir esta tarefa?")) return;

    try {
      await taskService.deleteTask(id);
      setTasks(prev => prev.filter(t => t.id !== id));
      setSelectedTask(null);
      showToast("Tarefa excluída com sucesso!");
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleOpenEdit = (task: Task) => {
    setTaskToEdit(task);
    setIsFormOpen(true);
  };

  // Filtragem unificada
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesFilter = filter === 'all' || task.status === filter;
      const matchesSearch = task.title.toLowerCase().includes(globalSearchTerm.toLowerCase()) || 
                           task.description.toLowerCase().includes(globalSearchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [tasks, filter, globalSearchTerm]);

  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold glow-purple tracking-tight">Minhas Tarefas</h2>
          <p className="text-gray-400 mt-1 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></span>
            {filteredTasks.length} {filteredTasks.length === 1 ? 'tarefa encontrada' : 'tarefas encontradas'}
          </p>
        </div>
        <button
          onClick={() => { setTaskToEdit(null); setIsFormOpen(true); }}
          className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto px-6 shadow-glow"
        >
          <Plus size={20} />
          Nova Tarefa
        </button>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-4 bg-surface/30 p-1.5 rounded-2xl border border-white/5 backdrop-blur-sm overflow-hidden">
        <div className="flex items-center gap-1 w-full flex-wrap sm:flex-nowrap">
          {(['all', 'pending', 'completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 lg:flex-none whitespace-nowrap px-6 py-2.5 rounded-xl text-xs lg:text-sm font-bold transition-all duration-300 ${
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

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => <SkeletonTask key={i} />)}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 glass-card border-red-500/20 bg-red-500/5">
          <AlertCircle className="text-red-500 mb-4" size={48} />
          <h3 className="text-xl font-bold text-white mb-2">Falha na Sincronização</h3>
          <p className="text-gray-400 mb-6 max-w-xs text-center">{error}</p>
          <button onClick={fetchTasks} className="btn-primary flex items-center gap-2">
            <RefreshCw size={18} /> Reestabelecer Conexão
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredTasks.map((task) => (
              <div key={task.id} onClick={() => setSelectedTask(task)} className="cursor-pointer">
                <TaskCard
                  task={task}
                  onToggle={handleToggleTask}
                  onDelete={handleDeleteTask}
                />
              </div>
            ))}
          </AnimatePresence>
          
          {filteredTasks.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full py-24 text-center glass-card border-dashed border-white/10">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-white/5 text-gray-600 mb-4">
                <Search size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-400">Nenhum resultado</h3>
              <p className="text-gray-500 mt-2">Nenhuma tarefa corresponde aos seus critérios atuais.</p>
            </motion.div>
          )}
        </div>
      )}

      {/* Modal de Detalhes da Tarefa */}
      <Modal isOpen={!!selectedTask} onClose={() => setSelectedTask(null)} title="Detalhes da Tarefa">
        {selectedTask && (
          <div className="space-y-6">
            <div className="bg-background/50 rounded-2xl p-5 border border-white/5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary-light">
                  <FileText size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Título</h4>
                  <p className="text-white text-lg font-semibold">{selectedTask.title}</p>
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Descrição</h4>
                <div className="max-h-[200px] overflow-y-auto overflow-x-hidden bg-white/5 rounded-xl border border-white/5">
                  <p className="text-gray-300 leading-relaxed p-4 whitespace-pre-wrap break-words">
                    {selectedTask.description || "Esta tarefa não possui uma descrição detalhada."}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2 text-xs text-gray-500 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                  <Calendar size={14} />
                  Criada em {new Date(selectedTask.createdAt).toLocaleDateString()}
                </div>
                <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase border tracking-tighter ${
                  selectedTask.status === 'completed' ? 'border-green-500/20 text-green-500 bg-green-500/5' : 'border-primary/20 text-primary-light bg-primary/5'
                }`}>
                  {selectedTask.status === 'completed' ? 'Concluída' : 'Em Aberto'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/5">
              <button onClick={() => handleToggleTask(selectedTask.id)} className={`flex flex-col items-center justify-center gap-1 py-3 rounded-2xl font-bold text-[10px] transition-all ${
                selectedTask.status === 'completed' ? 'bg-white/5 text-gray-400 hover:bg-white/10' : 'bg-primary/20 text-primary-light border border-primary/30 hover:bg-primary/30'
              }`}>
                <CheckCircle2 size={18} />
                {selectedTask.status === 'completed' ? 'Reabrir' : 'Concluir'}
              </button>
              <button onClick={() => handleOpenEdit(selectedTask)} className="flex flex-col items-center justify-center gap-1 py-3 rounded-2xl font-bold text-[10px] bg-white/5 text-gray-400 border border-white/5 hover:bg-white/10 transition-all">
                <Edit3 size={18} />
                Editar
              </button>
              <button onClick={() => handleDeleteTask(selectedTask.id)} className="flex flex-col items-center justify-center gap-1 py-3 rounded-2xl font-bold text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all">
                <Trash2 size={18} />
                Excluir
              </button>
            </div>
          </div>
        )}
      </Modal>

      <TaskForm
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setTaskToEdit(null); }}
        onSubmit={handleSubmitTask}
        initialData={taskToEdit}
      />

      <Toast {...toast} onClose={() => setToast(prev => ({ ...prev, isVisible: false }))} />
    </div>
  );
};

export default TasksPage;
