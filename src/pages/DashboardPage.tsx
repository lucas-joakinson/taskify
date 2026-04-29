import React, { useEffect, useState, useMemo } from 'react';
import { taskService } from '../services/api';
import { Task, DashboardStats } from '../types';
import StatsCard from '../components/StatsCard';
import { CheckCircle2, Clock, ListChecks, TrendingUp, AlertCircle, PlayCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const DashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats>({ total: 0, todo: 0, inProgress: 0, done: 0 });
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await taskService.getTasks();
      setTasks(data);
      const todo = data.filter(t => t.status === 'todo').length;
      const inProgress = data.filter(t => t.status === 'in-progress').length;
      const done = data.filter(t => t.status === 'done').length;
      const total = data.length;
      
      setStats({
        total,
        todo,
        inProgress,
        done
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const completionRate = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;

  const weeklyData = useMemo(() => {
    const counts = new Array(7).fill(0);
    const today = new Date();
    const firstDayOfWeek = new Date(today);
    firstDayOfWeek.setDate(today.getDate() - today.getDay());
    firstDayOfWeek.setHours(0, 0, 0, 0);

    tasks.forEach(task => {
      if (task.status === 'done') {
        const date = new Date(task.createdAt);
        if (date >= firstDayOfWeek) {
          counts[date.getDay()]++;
        }
      }
    });

    const labels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'];
    const data = [counts[1], counts[2], counts[3], counts[4], counts[5], counts[6], counts[0]];
    
    return { labels, data };
  }, [tasks]);


  const doughnutData = {
    labels: ['Concluídas', 'Em Curso', 'A Fazer'],
    datasets: [
      {
        data: [stats.done, stats.inProgress, stats.todo],
        backgroundColor: ['rgba(34, 197, 94, 0.8)', 'rgba(59, 130, 246, 0.8)', 'rgba(168, 85, 247, 0.8)'],
        borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        hoverOffset: 10,
      },
    ],
  };

  const barData = {
    labels: weeklyData.labels,
    datasets: [
      {
        label: 'Tarefas Concluídas',
        data: weeklyData.data,
        backgroundColor: 'rgba(168, 85, 247, 0.6)',
        borderRadius: 8,
        hoverBackgroundColor: 'rgba(168, 85, 247, 0.9)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { 
        grid: { color: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }, 
        ticks: { color: '#6b7280', font: { size: 10 } } 
      },
      x: { 
        grid: { display: false }, 
        ticks: { color: '#6b7280', font: { size: 10 } } 
      },
    },
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-120px)] gap-4">
      <div className="h-12 w-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin shadow-glow"></div>
      <p className="text-slate-500 animate-pulse font-medium">Sincronizando dados...</p>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-120px)] text-center p-6">
      <AlertCircle className="text-red-500 mb-4" size={48} />
      <h3 className="text-xl font-bold text-foreground mb-2">Falha ao carregar métricas</h3>
      <p className="text-slate-500 max-w-xs">{error}</p>
      <button onClick={fetchData} className="btn-primary mt-6">Tentar Novamente</button>
    </div>
  );

  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold glow-purple text-foreground">Visão Geral</h2>
          <p className="text-slate-500 mt-1">Sua produtividade em tempo real.</p>
        </div>
        <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-2xl">
          <TrendingUp className="text-primary" size={18} />
          <span className="text-sm font-semibold text-primary">{completionRate}% Concluído</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <StatsCard
          label="Total"
          value={stats.total}
          icon={ListChecks}
          color="bg-slate-500"
          delay={0.1}
        />
        <StatsCard
          label="A Fazer"
          value={stats.todo}
          icon={Clock}
          color="bg-primary"
          delay={0.2}
        />
        <StatsCard
          label="Em Curso"
          value={stats.inProgress}
          icon={PlayCircle}
          color="bg-blue-500"
          delay={0.3}
        />
        <StatsCard
          label="Concluídas"
          value={stats.done}
          icon={CheckCircle2}
          color="bg-green-500"
          delay={0.4}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6 lg:p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-semibold text-lg text-foreground">Histórico Semanal</h3>
              <p className="text-xs text-slate-500 mt-1">Tarefas concluídas por dia</p>
            </div>
          </div>
          <div className="h-[250px] lg:h-[300px]">
            <Bar data={barData} options={chartOptions} />
          </div>
        </div>

        <div className="glass-card p-6 lg:p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-semibold text-lg text-center w-full text-foreground">Distribuição de Status</h3>
          </div>
          <div className="h-[200px] lg:h-[250px] flex items-center justify-center relative">
            <Doughnut data={doughnutData} options={{ 
              responsive: true,
              maintainAspectRatio: false,
              cutout: '75%',
              plugins: { 
                legend: { display: false },
                tooltip: { enabled: true }
              },
            }} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold font-mono text-foreground">{completionRate}%</span>
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Taxa</span>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center p-2 bg-input rounded-xl border border-border/10">
              <span className="text-[10px] text-slate-500 uppercase font-bold">A Fazer</span>
              <span className="text-foreground font-mono font-bold">{stats.todo}</span>
            </div>
            <div className="flex flex-col items-center p-2 bg-input rounded-xl border border-border/10">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Em Curso</span>
              <span className="text-foreground font-mono font-bold">{stats.inProgress}</span>
            </div>
            <div className="flex flex-col items-center p-2 bg-input rounded-xl border border-border/10">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Concluído</span>
              <span className="text-foreground font-mono font-bold">{stats.done}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
