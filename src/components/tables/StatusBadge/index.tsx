import React from 'react';
import { StatusConfig } from '@/types';

interface StatusBadgeProps {
  status: string;
  config: StatusConfig;
}

const colorClasses = {
  green: 'bg-green-100 text-green-800',
  yellow: 'bg-yellow-100 text-yellow-800',
  red: 'bg-red-100 text-red-800',
  blue: 'bg-blue-100 text-blue-800',
  gray: 'bg-gray-100 text-gray-800',
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, config }) => {
  const statusConfig = config[status];
  if (!statusConfig) return <span>{status}</span>;

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium text-nowrap ${colorClasses[statusConfig.color]}`}
    >
      {statusConfig.label}
    </span>
  );
};
