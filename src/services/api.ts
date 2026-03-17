import { Task, User } from '../types';

// Simulação de delay para parecer uma API real
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock Data inicial
const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    title: 'Finalizar design do dashboard',
    description: 'Ajustar as cores e o glow roxo nos cards.',
    status: 'completed',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Implementar CRUD de tarefas',
    description: 'Conectar o frontend com o mock service.',
    status: 'pending',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Configurar rotas do sistema',
    description: 'Utilizar React Router para navegação.',
    status: 'pending',
    createdAt: new Date().toISOString(),
  },
];

export const taskService = {
  async getTasks(): Promise<Task[]> {
    await delay(200);
    const tasks = localStorage.getItem('tasks');
    if (!tasks) {
      localStorage.setItem('tasks', JSON.stringify(INITIAL_TASKS));
      return INITIAL_TASKS;
    }
    return JSON.parse(tasks);
  },

  async createTask(task: Omit<Task, 'id' | 'createdAt'>): Promise<Task> {
    await delay(200);
    const tasks = await this.getTasks();
    const newTask: Task = {
      ...task,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };
    const updatedTasks = [newTask, ...tasks];
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    return newTask;
  },

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    await delay(200);
    const tasks = await this.getTasks();
    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) throw new Error('Tarefa não encontrada');
    
    const updatedTask = { ...tasks[taskIndex], ...updates };
    tasks[taskIndex] = updatedTask;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    return updatedTask;
  },

  async deleteTask(id: string): Promise<void> {
    await delay(200);
    const tasks = await this.getTasks();
    const filteredTasks = tasks.filter(t => t.id !== id);
    localStorage.setItem('tasks', JSON.stringify(filteredTasks));
  }
};

export const authService = {
  async login(email: string): Promise<User> {
    await delay(500);
    const user: User = {
      id: '1',
      name: email.split('@')[0],
      email: email,
      avatar: `https://ui-avatars.com/api/?name=${email}&background=a855f7&color=fff`
    };
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  },

  logout() {
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  getCurrentUser(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};
