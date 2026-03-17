import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error';

interface ToastProps {
  message: string;
  type: ToastType;
  isVisible: boolean;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 20, x: '-50%', scale: 0.95 }}
          className="fixed bottom-10 left-1/2 z-[100] min-w-[300px]"
        >
          <div className={`glass-card p-4 flex items-center gap-3 border-l-4 shadow-glow ${
            type === 'success' ? 'border-l-primary border-primary/20 bg-primary/10' : 'border-l-red-500 border-red-500/20 bg-red-500/10'
          }`}>
            {type === 'success' ? (
              <CheckCircle2 className="text-primary" size={20} />
            ) : (
              <AlertCircle className="text-red-500" size={20} />
            )}
            <p className="text-sm font-medium text-white flex-1">{message}</p>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
              <X size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
