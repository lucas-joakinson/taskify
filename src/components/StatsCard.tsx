import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatsCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  color: string;
  delay?: number;
}

const StatsCard: React.FC<StatsCardProps> = ({ label, value, icon: Icon, color, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass-card p-6 flex items-center gap-4 hover:border-primary/30 transition-all duration-300"
    >
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-opacity-20 ${color} text-${color.split('-')[1]}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm text-gray-400 font-medium">{label}</p>
        <p className="text-2xl font-bold font-mono text-white mt-1">{value}</p>
      </div>
    </motion.div>
  );
};

export default StatsCard;
