import React, { useState, useEffect } from 'react';
import { Plus, Save } from 'lucide-react';
import Modal from './Modal';
import { Task } from '../types';

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, description: string) => void;
  initialData?: Task | null;
}

const TaskForm: React.FC<TaskFormProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Sincroniza o estado com os dados iniciais quando o modal abre para edição
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
    } else {
      setTitle('');
      setDescription('');
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit(title, description);
    // Reset acontece no useEffect ao fechar/abrir, mas limpamos aqui também por segurança
    if (!initialData) {
      setTitle('');
      setDescription('');
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
