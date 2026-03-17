export type TaskStatus = 'pending' | 'completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface DashboardStats {
  total: number;
  completed: number;
  pending: number;
  completionRate: number;
}
