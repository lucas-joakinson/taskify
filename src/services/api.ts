import { Task, User } from '../types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const STORAGE_KEY = 'taskify_tasks';

export const taskService = {
  // Simula GET /tasks
  async getTasks(): Promise<Task[]> {
    try {
      await delay(400); // Reduzido de 1200
      const data = localStorage.getItem(STORAGE_KEY);
      let tasks: any[] = data ? JSON.parse(data) : [];
      
      // Migração simples para novos status se necessário
      const migratedTasks = tasks.map(t => {
        if (t.status === 'pending') return { ...t, status: 'todo' };
        if (t.status === 'completed') return { ...t, status: 'done' };
        return t;
      });

      if (JSON.stringify(tasks) !== JSON.stringify(migratedTasks)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(migratedTasks));
      }

      return migratedTasks;
    } catch (error) {
      console.error("Erro na API getTasks:", error);
      throw new Error("Não foi possível carregar as tarefas. Tente novamente.");
    }
  },

  // Simula POST /tasks
  async createTask(taskData: Omit<Task, 'id' | 'createdAt'>): Promise<Task> {
    try {
      await delay(300);
      const tasks = await this.getTasks();
      
      const newTask: Task = {
        ...taskData,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };

      const updatedTasks = [newTask, ...tasks];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
      return newTask;
    } catch (error) {
      console.error("Erro na API createTask:", error);
      throw new Error("Erro ao criar tarefa. Verifique sua conexão.");
    }
  },

  // Simula PATCH /tasks/:id
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
      console.error("Erro na API updateTask:", error);
      throw new Error("Erro ao atualizar tarefa.");
    }
  },

  // Simula DELETE /tasks/:id
  async deleteTask(id: string): Promise<void> {
    try {
      await delay(200);
      const tasks = await this.getTasks();
      const filteredTasks = tasks.filter(t => t.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredTasks));
    } catch (error) {
      console.error("Erro na API deleteTask:", error);
      throw new Error("Erro ao deletar tarefa.");
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
