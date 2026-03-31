import React from 'react';
import { Comment } from '../types';

interface CommentItemProps {
  comment: Comment;
}

export const CommentItem: React.FC<CommentItemProps> = ({ comment }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="flex gap-3 py-3 border-b border-white/5 last:border-0">
      <img
        src={comment.userAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${comment.userName}`}
        alt={comment.userName}
        className="w-8 h-8 rounded-full bg-white/10 object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-sm font-semibold text-white truncate">
            {comment.userName}
          </span>
          <span className="text-[10px] text-gray-500 whitespace-nowrap uppercase tracking-widest font-medium">
            {formatDate(comment.createdAt)}
          </span>
        </div>
        <div className="bg-white/5 rounded-xl border border-white/5 p-3 mt-1">
          <p className="text-sm text-gray-300 break-words leading-relaxed">
            {comment.text}
          </p>
        </div>
      </div>
    </div>
  );
};
