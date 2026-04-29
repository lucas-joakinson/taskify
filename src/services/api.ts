import { Task, User } from '../types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const STORAGE_KEY = 'taskify_tasks';

export const taskService = {
  async getTasks(): Promise<Task[]> {
    try {
      await delay(400);
      const data = localStorage.getItem(STORAGE_KEY);
      let tasks: any[] = data ? JSON.parse(data) : [];
      
      const migratedTasks = tasks.map(t => {
        let updated = { ...t };
        if (t.status === 'pending') updated.status = 'todo';
        if (t.status === 'completed') updated.status = 'done';
        if (!updated.comments) updated.comments = [];
        return updated;
      });

      if (JSON.stringify(tasks) !== JSON.stringify(migratedTasks)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(migratedTasks));
      }

      return migratedTasks;
    } catch (error) {
      throw new Error("Não foi possível carregar as tarefas. Tente novamente.");
    }
  },

  async createTask(taskData: Omit<Task, 'id' | 'createdAt' | 'comments'>): Promise<Task> {
    try {
      await delay(300);
      const tasks = await this.getTasks();
      
      const newTask: Task = {
        ...taskData,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        comments: []
      };

      const updatedTasks = [newTask, ...tasks];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
      return newTask;
    } catch (error) {
      throw new Error("Erro ao criar tarefa. Verifique sua conexão.");
    }
  },

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    try {
      await delay(200);
      const tasks = await this.getTasks();
      const index = tasks.findIndex(t => t.id === id);
      
      if (index === -1) throw new Error("Tarefa não encontrada no servidor.");

      const updatedTask = { ...tasks[index], ...updates };
      tasks[index] = updatedTask;
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      return updatedTask;
    } catch (error) {
      throw new Error("Erro ao atualizar tarefa.");
    }
  },

  async deleteTask(id: string): Promise<void> {
    try {
      await delay(200);
      const tasks = await this.getTasks();
      const filteredTasks = tasks.filter(t => t.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredTasks));
    } catch (error) {
      throw new Error("Erro ao deletar tarefa.");
    }
  },

  async addComment(taskId: string, text: string): Promise<Task> {
    try {
      await delay(200);
      const user = authService.getCurrentUser();
      if (!user) throw new Error("Usuário não autenticado.");

      const tasks = await this.getTasks();
      const taskIndex = tasks.findIndex(t => t.id === taskId);
      if (taskIndex === -1) throw new Error("Tarefa não encontrada.");

      const newComment = {
        id: crypto.randomUUID(),
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        text,
        createdAt: new Date().toISOString()
      };

      tasks[taskIndex].comments.push(newComment);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      return tasks[taskIndex];
    } catch (error) {
      throw new Error("Erro ao adicionar comentário.");
    }
  }
};

export const authService = {
  async login(email: string): Promise<User> {
    await delay(400);
    const user: User = {
      id: 'user_1',
      name: email.split('@')[0],
      email: email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
    };
    localStorage.setItem('taskify_user', JSON.stringify(user));
    return user;
  },

  logout() {
    localStorage.removeItem('taskify_user');
    window.location.href = '/login';
  },

  getCurrentUser(): User | null {
    const user = localStorage.getItem('taskify_user');
    return user ? JSON.parse(user) : null;
  }
};
