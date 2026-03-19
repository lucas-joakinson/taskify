import React from 'react';

interface DropIndicatorProps {
  beforeId: string | null;
  status: string;
}

const DropIndicator: React.FC<DropIndicatorProps> = ({ beforeId, status }) => {
  return (
    <div
      data-before={beforeId || "-1"}
      data-status={status}
      className="my-0.5 h-0.5 w-full bg-primary opacity-0 transition-opacity"
    />
  );
};

export default DropIndicator;
