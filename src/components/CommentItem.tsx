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
    <div className="flex gap-3 py-3 border-b border-gray-100 last:border-0">
      <img
        src={comment.userAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${comment.userName}`}
        alt={comment.userName}
        className="w-8 h-8 rounded-full bg-gray-200 object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-sm font-semibold text-gray-900 truncate">
            {comment.userName}
          </span>
          <span className="text-xs text-gray-500 whitespace-nowrap">
            {formatDate(comment.createdAt)}
          </span>
        </div>
        <p className="text-sm text-gray-600 break-words leading-relaxed">
          {comment.text}
        </p>
      </div>
    </div>
  );
};
