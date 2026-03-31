import React from 'react';
import { Comment } from '../types';
import { CommentItem } from './CommentItem';

interface CommentListProps {
  comments: Comment[];
}

export const CommentList: React.FC<CommentListProps> = ({ comments }) => {
  if (comments.length === 0) {
    return (
      <div className="py-6 text-center text-sm text-gray-500 italic">
        Nenhum comentário ainda.
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
};
