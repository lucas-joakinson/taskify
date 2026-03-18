import React, { useState, useEffect } from 'react';
import { Plus, Save } from 'lucide-react';
import Modal from './Modal';
import { Task, TaskStatus } from '../types';

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, description: string, status: TaskStatus) => void;
  initialData?: Task | null;
  defaultStatus?: TaskStatus;
}

const TaskForm: React.FC<TaskFormProps> = ({ isOpen, onClose, onSubmit, initialData, defaultStatus = 'todo' }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('todo');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setStatus(initialData.status);
    } else {
      setTitle('');
      setDescription('');
      setStatus(defaultStatus);
    }
  }, [initialData, isOpen, defaultStatus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit(title, description, status);
    if (!initialData) {
      setTitle('');
      setDescription('');
      setStatus('todo');
    }
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={initialData ? "Editar Tarefa" : "Nova Tarefa"}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-widest text-[10px]">Título da Tarefa</label>
          <input
            autoFocus
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Refatorar componente de Login"
            className="input-field w-full h-12"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-widest text-[10px]">Descrição (Opcional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descreva os detalhes da tarefa..."
            rows={4}
            className="input-field w-full resize-none p-4 min-h-[120px]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-widest text-[10px]">Status</label>
          <div className="grid grid-cols-3 gap-2">
            {(['todo', 'in-progress', 'done'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatus(s)}
                className={`py-2.5 rounded-xl text-[10px] font-bold uppercase transition-all border ${
                  status === s 
                    ? 'bg-primary border-primary text-white shadow-glow' 
                    : 'bg-white/5 border-white/5 text-gray-500 hover:bg-white/10'
                }`}
              >
                {s === 'todo' ? 'A fazer' : s === 'in-progress' ? 'Em curso' : 'Concluído'}
              </button>
            ))}
          </div>
        </div>
        
        <div className="pt-2">
          <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2 h-12 shadow-glow">
            {initialData ? <Save size={20} /> : <Plus size={20} />}
            {initialData ? "Salvar Alterações" : "Criar Tarefa"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TaskForm;
