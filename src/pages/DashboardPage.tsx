import React, { useEffect, useState, useMemo } from 'react';
import { taskService } from '../services/api';
import { Task, DashboardStats } from '../types';
import StatsCard from '../components/StatsCard';
import { CheckCircle2, Clock, ListChecks, TrendingUp, AlertCircle } from 'lucide-react';
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
  const [stats, setStats] = useState<DashboardStats>({ total: 0, completed: 0, pending: 0, completionRate: 0 });
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await taskService.getTasks();
      setTasks(data);
      const completed = data.filter(t => t.status === 'completed').length;
      const total = data.length;
      
      setStats({
        total,
        completed,
        pending: total - completed,
        completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
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

  // Cálculo do histórico semanal baseado em tarefas reais
  const weeklyData = useMemo(() => {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
    const counts = new Array(7).fill(0);
    
    // Pega o início da semana atual (domingo)
    const today = new Date();
    const firstDayOfWeek = new Date(today);
    firstDayOfWeek.setDate(today.getDate() - today.getDay());
    firstDayOfWeek.setHours(0, 0, 0, 0);

    tasks.forEach(task => {
      if (task.status === 'completed') {
        const date = new Date(task.createdAt);
        if (date >= firstDayOfWeek) {
          counts[date.getDay()]++;
        }
      }
    });

    // Reordenar para começar de Segunda se preferir, ou manter Dom-Sab
    // Vamos manter Seg-Dom como no gráfico original
    const labels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'];
    const data = [counts[1], counts[2], counts[3], counts[4], counts[5], counts[6], counts[0]];
    
    return { labels, data };
  }, [tasks]);

  // Dados reais para o gráfico de pizza (Doughnut)
  const doughnutData = {
    labels: ['Concluídas', 'Pendentes'],
    datasets: [
      {
        data: [stats.completed, stats.pending],
        backgroundColor: ['rgba(168, 85, 247, 0.8)', 'rgba(168, 85, 247, 0.1)'],
        borderColor: ['rgba(168, 85, 247, 1)', 'rgba(255, 255, 255, 0.05)'],
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
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#6b7280', font: { size: 10 } } },
      x: { grid: { display: false }, ticks: { color: '#6b7280', font: { size: 10 } } },
    },
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-120px)] gap-4">
      <div className="h-12 w-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin shadow-glow"></div>
      <p className="text-gray-500 animate-pulse font-medium">Sincronizando dados...</p>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-120px)] text-center p-6">
      <AlertCircle className="text-red-500 mb-4" size={48} />
      <h3 className="text-xl font-bold text-white mb-2">Falha ao carregar métricas</h3>
      <p className="text-gray-400 max-w-xs">{error}</p>
      <button onClick={fetchData} className="btn-primary mt-6">Tentar Novamente</button>
    </div>
  );

  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold glow-purple">Visão Geral</h2>
          <p className="text-gray-400 mt-1">Sua produtividade em tempo real.</p>
        </div>
        <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-2xl">
          <TrendingUp className="text-primary-light" size={18} />
          <span className="text-sm font-semibold text-primary-light">{stats.completionRate}% Concluído</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <StatsCard
          label="Total de Tarefas"
          value={stats.total}
          icon={ListChecks}
          color="bg-primary"
          delay={0.1}
        />
        <StatsCard
          label="Concluídas"
          value={stats.completed}
          icon={CheckCircle2}
          color="bg-green-500"
          delay={0.2}
        />
        <StatsCard
          label="Pendentes"
          value={stats.pending}
          icon={Clock}
          color="bg-yellow-500"
          delay={0.3}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6 lg:p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-semibold text-lg">Histórico Semanal</h3>
              <p className="text-xs text-gray-500 mt-1">Comparação de tarefas concluídas por dia</p>
            </div>
          </div>
          <div className="h-[250px] lg:h-[300px]">
            <Bar data={barData} options={chartOptions} />
          </div>
        </div>

        <div className="glass-card p-6 lg:p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-semibold text-lg text-center w-full">Distribuição</h3>
          </div>
          <div className="h-[200px] lg:h-[250px] flex items-center justify-center relative">
            <Doughnut data={doughnutData} options={{ 
              ...chartOptions, 
              cutout: '75%',
              plugins: { legend: { display: false } } 
            }} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold font-mono text-white">{stats.completionRate}%</span>
              <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Taxa</span>
            </div>
          </div>
          <div className="mt-8 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-gray-400">
                <span className="h-2 w-2 rounded-full bg-primary"></span> Concluídas
              </span>
              <span className="text-white font-mono font-bold">{stats.completed}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-gray-400">
                <span className="h-2 w-2 rounded-full bg-white/10"></span> Pendentes
              </span>
              <span className="text-white font-mono font-bold">{stats.pending}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
