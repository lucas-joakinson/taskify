import React, { useEffect, useState } from 'react';
import { taskService } from '../services/api';
import { Task, DashboardStats } from '../types';
import StatsCard from '../components/StatsCard';
import { CheckCircle2, Clock, ListChecks, TrendingUp } from 'lucide-react';
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
  const [stats, setStats] = useState<DashboardStats>({ total: 0, completed: 0, pending: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const tasks = await taskService.getTasks();
      const completed = tasks.filter(t => t.status === 'completed').length;
      setStats({
        total: tasks.length,
        completed,
        pending: tasks.length - completed,
      });
      setLoading(false);
    };
    fetchStats();
  }, []);

  const barData = {
    labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'],
    datasets: [
      {
        label: 'Tarefas Concluídas',
        data: [12, 19, 3, 5, 2, 3, 7],
        backgroundColor: 'rgba(168, 85, 247, 0.6)',
        borderRadius: 8,
      },
    ],
  };

  const doughnutData = {
    labels: ['Concluídas', 'Pendentes'],
    datasets: [
      {
        data: [stats.completed, stats.pending],
        backgroundColor: ['rgba(168, 85, 247, 0.8)', 'rgba(168, 85, 247, 0.2)'],
        borderColor: ['rgba(168, 85, 247, 1)', 'rgba(168, 85, 247, 0.2)'],
        borderWidth: 1,
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
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#9ca3af' } },
      x: { grid: { display: false }, ticks: { color: '#9ca3af' } },
    },
  };

  if (loading) return (
    <div className="flex items-center justify-center h-[calc(100vh-120px)]">
      <div className="h-10 w-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold glow-purple">Dashboard Overview</h2>
        <p className="text-gray-400 mt-1">Bem-vindo à sua central de gerenciamento.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        <div className="glass-card p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <TrendingUp className="text-primary" size={20} />
              Produtividade Semanal
            </h3>
          </div>
          <div className="h-[300px]">
            <Bar data={barData} options={chartOptions} />
          </div>
        </div>

        <div className="glass-card p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <ListChecks className="text-primary" size={20} />
              Distribuição de Tarefas
            </h3>
          </div>
          <div className="h-[300px] flex items-center justify-center">
            <Doughnut data={doughnutData} options={{ ...chartOptions, plugins: { legend: { display: true, position: 'bottom', labels: { color: '#9ca3af' } } } }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
