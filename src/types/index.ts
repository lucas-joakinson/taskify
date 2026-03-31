export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  text: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: string;
  comments: Comment[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface DashboardStats {
  total: number;
  todo: number;
  inProgress: number;
  done: number;
}
