import React from 'react';

interface DateStatusBadgeProps {
  value: string;
}

const colorClasses = {
  yellow: 'bg-yellow-100 text-yellow-800',
  red: 'bg-red-100 text-red-800',
  white: 'bg-gray-100 text-gray-800',
};

export const DateStatusBadge: React.FC<DateStatusBadgeProps> = ({ value }) => {
  const getDateStatus = (dateString: string) => {
    if (!dateString) {
      return { color: 'white', label: 'Нет данных' };
    }

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Парсим дату в формате DD-MM-YYYY или YYYY-MM-DD
      let contractDate: Date;
      if (dateString.includes('-')) {
        if (dateString.split('-')[0].length === 4) {
          // Формат YYYY-MM-DD
          contractDate = new Date(dateString);
        } else {
          // Формат DD-MM-YYYY
          contractDate = new Date(dateString.split('-').reverse().join('-'));
        }
      } else {
        contractDate = new Date(dateString);
      }

      contractDate.setHours(0, 0, 0, 0);

      const diffTime = contractDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      console.log('DateStatusBadge debug:', {
        dateString,
        today: today.toISOString(),
        contractDate: contractDate.toISOString(),
        diffDays,
      });

      if (diffDays < 0) {
        return { color: 'red', label: 'Истек' };
      } else if (diffDays <= 15) {
        return { color: 'yellow', label: `${diffDays} дн.` };
      } else {
        return { color: 'white', label: 'Активен' };
      }
    } catch (error) {
      console.error('Error parsing date:', error);
      return { color: 'white', label: 'Ошибка даты' };
    }
  };

  const status = getDateStatus(value);

  const bgColorClasses = {
    yellow: 'bg-yellow-50',
    red: 'bg-red-50',
    white: 'bg-white',
  };

  return (
    <td
      className={`px-4 py-3 text-sm text-gray-900 ${bgColorClasses[status.color as keyof typeof bgColorClasses]}`}
    >
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${colorClasses[status.color as keyof typeof colorClasses] || colorClasses.white}`}
      >
        {status.label}
      </span>
      <span className="ml-2 text-gray-600 text-nowrap">{value}</span>
    </td>
  );
};
