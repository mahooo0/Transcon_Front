import {
  Truck,
  Users,
  DollarSign,
  FileText,
  Clock,
  Package,
  ClipboardList,
  CreditCard,
  TrendingUp,
  Car,
  User,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/redux/typeHooks';
import { RootState } from '@/redux/store';
import { ActionNames, ModuleNames } from '@/types/enum';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state: RootState) => state.auth);

  // Функция для проверки прав доступа к модулю
  const hasPermission = (module: string, action: string = ActionNames.READ) => {
    return user.permissions.some(
      (permission) =>
        permission.module === module && permission.action === action
    );
  };
  // Mock data for dashboard
  const stats = [
    {
      title: 'Активные фрахты',
      value: '24',
      change: '+12%',
      icon: Truck,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Водители',
      value: '156',
      change: '+8%',
      icon: Users,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      title: 'Общий доход',
      value: '€45,230',
      change: '+23%',
      icon: DollarSign,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      title: 'Записи в журнале',
      value: '89',
      change: '+5%',
      icon: FileText,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
    },
  ];

  // Навигационные карточки с проверкой прав доступа
  const navigationCards = [
    {
      title: 'Фрахты',
      description: 'Управление грузоперевозками',
      icon: Package,
      path: '/freights',
      module: ModuleNames.FREIGHTS,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Журнал происшествий',
      description: 'Записи о происшествиях',
      icon: ClipboardList,
      path: '/journal',
      module: ModuleNames.FINANCE,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
    },
    {
      title: 'Оплаты',
      description: 'Финансовые операции',
      icon: CreditCard,
      path: '/payments',
      module: ModuleNames.FINANCE,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      title: 'Финансовые отчёты',
      description: 'Аналитика и отчёты',
      icon: TrendingUp,
      path: '/finance/monthly-report',
      module: ModuleNames.FINANCE,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      title: 'Водители',
      description: 'Управление водителями',
      icon: User,
      path: '/drivers',
      module: ModuleNames.DRIVERS,
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
    },
    {
      title: 'Сотрудники',
      description: 'Управление персоналом',
      icon: Users,
      path: '/employees',
      module: ModuleNames.USERS,
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50',
      iconColor: 'text-pink-600',
    },
    {
      title: 'Тягачи',
      description: 'Управление тягачами',
      icon: Truck,
      path: '/transport/trucks',
      module: ModuleNames.VEHICLES,
      color: 'from-gray-500 to-gray-600',
      bgColor: 'bg-gray-50',
      iconColor: 'text-gray-600',
    },
    {
      title: 'Прицепы',
      description: 'Управление прицепами',
      icon: Car,
      path: '/transport/trailers',
      module: ModuleNames.VEHICLES,
      color: 'from-teal-500 to-teal-600',
      bgColor: 'bg-teal-50',
      iconColor: 'text-teal-600',
    },
    {
      title: 'Доп. транспорт',
      description: 'Дополнительные ТС',
      icon: Car,
      path: '/transport/extra',
      module: ModuleNames.VEHICLES,
      color: 'from-cyan-500 to-cyan-600',
      bgColor: 'bg-cyan-50',
      iconColor: 'text-cyan-600',
    },
  ];

  // Фильтруем карточки по правам доступа
  const accessibleCards = navigationCards.filter((card) =>
    hasPermission(card.module, ActionNames.READ)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Добро пожаловать в TransCon
              </h1>
              <p className="text-gray-600">
                Обзор вашей системы управления грузоперевозками
              </p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>{new Date().toLocaleDateString('ru-RU')}</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-800">
                      {stat.value}
                    </p>
                    <p className="text-sm text-green-600 font-medium">
                      {stat.change}
                    </p>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <IconComponent className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Cards */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Навигация по приложению
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {accessibleCards.map((card, index) => {
              const IconComponent = card.icon;
              return (
                <button
                  key={index}
                  onClick={() => navigate(card.path)}
                  className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-200 text-left group"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`${card.bgColor} p-3 rounded-lg group-hover:scale-110 transition-transform duration-200`}
                    >
                      <IconComponent className={`w-6 h-6 ${card.iconColor}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 group-hover:text-gray-900 mb-1">
                        {card.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {card.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
