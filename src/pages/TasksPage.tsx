import React, { useEffect, useState, useMemo } from 'react';
import { taskService } from '../services/api';
import { Task, TaskStatus } from '../types';
import KanbanBoard from '../components/KanbanBoard';
import TaskForm from '../components/TaskForm';
import SkeletonTask from '../components/SkeletonTask';
import Toast, { ToastType } from '../components/Toast';
import Modal from '../components/Modal';
import { CommentList } from '../components/CommentList';
import { CommentForm } from '../components/CommentForm';
import { Plus, Search, RefreshCw, AlertCircle, Trash2, Calendar, FileText, Edit3, Layout, MessageSquare } from 'lucide-react';

interface TasksPageProps {
  globalSearchTerm?: string;
  setGlobalSearchTerm?: (val: string) => void;
}

const TasksPage: React.FC<TasksPageProps> = ({ globalSearchTerm = '', setGlobalSearchTerm }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>('todo');

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

  const handleSubmitTask = async (title: string, description: string, status: TaskStatus) => {
    try {
      if (taskToEdit) {
        const updated = await taskService.updateTask(taskToEdit.id, { title, description, status });
        setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
        if (selectedTask?.id === updated.id) setSelectedTask(updated);
        showToast("Tarefa atualizada!");
      } else {
        const newTask = await taskService.createTask({ title, description, status });
        setTasks(prev => [newTask, ...prev]);
        showToast("Tarefa criada!");
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setTaskToEdit(null);
    }
  };

  const handleMoveTask = async (id: string, newStatus: TaskStatus, index?: number) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    
    const oldTasks = [...tasks];
    
    setTasks(prev => {
      const filtered = prev.filter(t => t.id !== id);
      const updatedTask = { ...task, status: newStatus };
      
      if (typeof index === 'number') {
        // Encontrar o ponto de inserção real dentro das tarefas do mesmo status
        const statusTasks = filtered.filter(t => t.status === newStatus);
        const otherTasks = filtered.filter(t => t.status !== newStatus);
        
        const newStatusTasks = [...statusTasks];
        newStatusTasks.splice(index, 0, updatedTask);
        
        return [...otherTasks, ...newStatusTasks];
      } else {
        return [updatedTask, ...filtered];
      }
    });

    try {
      await taskService.updateTask(id, { status: newStatus });
    } catch (err: any) {
      setTasks(oldTasks);
      showToast(err.message, 'error');
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!window.confirm("Excluir esta tarefa?")) return;

    try {
      await taskService.deleteTask(id);
      setTasks(prev => prev.filter(t => t.id !== id));
      setSelectedTask(null);
      showToast("Tarefa excluída!");
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleOpenEdit = (task: Task) => {
    setTaskToEdit(task);
    setIsFormOpen(true);
  };

  const handleCommentAdded = (updatedTask: Task) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    setSelectedTask(updatedTask);
    showToast("Comentário adicionado!");
  };

  const handleAddTaskByColumn = (status: TaskStatus) => {
    setDefaultStatus(status);
    setTaskToEdit(null);
    setIsFormOpen(true);
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(globalSearchTerm.toLowerCase()) || 
                           task.description.toLowerCase().includes(globalSearchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [tasks, globalSearchTerm]);

  return (
    <div className="h-full flex flex-col space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Layout className="text-primary-light" size={24} />
            <h2 className="text-2xl lg:text-3xl font-bold glow-purple tracking-tight">Quadro Kanban</h2>
          </div>
          <p className="text-gray-400 text-sm flex items-center gap-2">
            Gerencie seu fluxo de trabalho de forma visual
          </p>
        </div>
        <button
          onClick={() => handleAddTaskByColumn('todo')}
          className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto px-6 shadow-glow"
        >
          <Plus size={20} />
          Nova Tarefa
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
        <input
          type="text"
          placeholder="Buscar no quadro..."
          value={globalSearchTerm}
          onChange={(e) => setGlobalSearchTerm?.(e.target.value)}
          className="w-full bg-surface/30 border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:border-primary/50 outline-none transition-all backdrop-blur-sm"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="space-y-4">
              <div className="h-10 bg-white/5 rounded-xl animate-pulse"></div>
              <SkeletonTask />
              <SkeletonTask />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 glass-card border-red-500/20 bg-red-500/5">
          <AlertCircle className="text-red-500 mb-4" size={48} />
          <h3 className="text-xl font-bold text-white mb-2">Erro de Conexão</h3>
          <p className="text-gray-400 mb-6 max-w-xs text-center">{error}</p>
          <button onClick={fetchTasks} className="btn-primary flex items-center gap-2">
            <RefreshCw size={18} /> Tentar Novamente
          </button>
        </div>
      ) : (
        <KanbanBoard
          tasks={filteredTasks}
          onAddTask={handleAddTaskByColumn}
          onDeleteTask={handleDeleteTask}
          onMoveTask={handleMoveTask}
          onSelectTask={setSelectedTask}
        />
      )}

      {/* Modal de Detalhes */}
      <Modal isOpen={!!selectedTask} onClose={() => setSelectedTask(null)} title="Detalhes da Tarefa">
        {selectedTask && (
          <div className="space-y-6">
            <div className="bg-background/50 rounded-2xl p-5 border border-white/5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary-light">
                  <FileText size={20} />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Título</h4>
                  <p className="text-white text-lg font-semibold">{selectedTask.title}</p>
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Descrição</h4>
                <div className="max-h-[200px] overflow-y-auto bg-white/5 rounded-xl border border-white/5">
                  <p className="text-gray-300 text-sm leading-relaxed p-4 whitespace-pre-wrap">
                    {selectedTask.description || "Sem descrição."}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2 text-[10px] text-gray-500">
                  <Calendar size={14} />
                  Criada em {new Date(selectedTask.createdAt).toLocaleDateString()}
                </div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border tracking-widest ${
                  selectedTask.status === 'done' ? 'border-green-500/20 text-green-500 bg-green-500/5' : 
                  selectedTask.status === 'in-progress' ? 'border-blue-500/20 text-blue-400 bg-blue-500/5' :
                  'border-primary/20 text-primary-light bg-primary/5'
                }`}>
                  {selectedTask.status === 'todo' ? 'A Fazer' : selectedTask.status === 'in-progress' ? 'Em Curso' : 'Concluído'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => handleOpenEdit(selectedTask)} className="flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-xs bg-white/5 text-gray-400 border border-white/5 hover:bg-white/10 transition-all">
                <Edit3 size={16} />
                Editar
              </button>
              <button onClick={() => handleDeleteTask(selectedTask.id)} className="flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-xs bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all">
                <Trash2 size={16} />
                Excluir
              </button>
            </div>

            <div className="pt-4 border-t border-white/5">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="text-primary-light" size={18} />
                <h4 className="text-sm font-bold text-white">Comentários</h4>
                <span className="bg-primary/20 text-primary-light text-[10px] px-2 py-0.5 rounded-full">
                  {selectedTask.comments?.length || 0}
                </span>
              </div>
              
              <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                <CommentList comments={selectedTask.comments || []} />
              </div>
              
              <CommentForm taskId={selectedTask.id} onCommentAdded={handleCommentAdded} />
            </div>
          </div>
        )}
      </Modal>

      <TaskForm
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setTaskToEdit(null); }}
        onSubmit={handleSubmitTask}
        initialData={taskToEdit}
        defaultStatus={defaultStatus}
      />

      <Toast {...toast} onClose={() => setToast(prev => ({ ...prev, isVisible: false }))} />
    </div>
  );
};

export default TasksPage;
