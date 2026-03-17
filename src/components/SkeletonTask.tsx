import React from 'react';

const SkeletonTask = () => {
  return (
    <div className="glass-card p-5 border-white/5 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-3">
          <div className="h-5 w-2/3 bg-white/10 rounded-lg"></div>
          <div className="h-4 w-full bg-white/5 rounded-lg"></div>
          <div className="h-4 w-1/2 bg-white/5 rounded-lg"></div>
          
          <div className="flex items-center gap-3 mt-6">
            <div className="h-4 w-16 bg-white/5 rounded-full"></div>
            <div className="h-4 w-12 bg-white/5 rounded-full"></div>
          </div>
        </div>
        <div className="flex flex-col gap-2 ml-4">
          <div className="h-9 w-9 bg-white/5 rounded-lg"></div>
          <div className="h-9 w-9 bg-white/5 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonTask;
