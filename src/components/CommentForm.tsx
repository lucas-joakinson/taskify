import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { taskService } from '../services/api';
import { Task } from '../types';

interface CommentFormProps {
  taskId: string;
  onCommentAdded: (updatedTask: Task) => void;
}

export const CommentForm: React.FC<CommentFormProps> = ({ taskId, onCommentAdded }) => {
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const updatedTask = await taskService.addComment(taskId, text);
      setText('');
      onCommentAdded(updatedTask);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative mt-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Escreva um comentário..."
        className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 pr-12 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all resize-none min-h-[48px] max-h-[120px] placeholder:text-gray-500"
        rows={1}
        onInput={(e) => {
          const target = e.target as HTMLTextAreaElement;
          target.style.height = 'auto';
          target.style.height = `${target.scrollHeight}px`;
        }}
      />
      <button
        type="submit"
        disabled={!text.trim() || isSubmitting}
        className="absolute right-2 top-1.5 p-1.5 text-purple-600 hover:text-purple-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        <Send className="w-4 h-4" />
      </button>
    </form>
  );
};
