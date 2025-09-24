import { ActionNames, ModuleNames } from '@/types/enum';

export interface INavItem {
  text: string;
  icon?: string;
  path?: string;
  children?: INavItem[];
  module?: ModuleNames;
  action?: ActionNames;
}

const navbarData = [
  {
    text: 'Дашборд',
    icon: 'home',
    path: '/dashboard',
  },
  {
    text: 'Фрахты',
    icon: 'package',
    path: '/freights',
    module: ModuleNames.FREIGHTS,
    action: ActionNames.READ,
  },
  {
    text: 'Журнал происшествий',
    icon: 'clipboard-list',
    path: '/journal',
    module: ModuleNames.FINANCE,
    action: ActionNames.READ,
  },
  {
    text: 'Финансы',
    icon: 'trending-up',
    module: ModuleNames.FINANCE,
    action: ActionNames.READ,
    children: [
      {
        text: 'Оплаты',
        icon: 'credit-card',
        path: '/payments',
        module: ModuleNames.FINANCE,
        action: ActionNames.READ,
      },
      {
        text: 'Финансовый отчёт по месяцам',
        path: '/finance/monthly-report',
        module: ModuleNames.FINANCE,
        action: ActionNames.READ,
      },
      {
        text: 'Отчёт по авто',
        path: '/car-report',
        module: ModuleNames.FINANCE,
        action: ActionNames.READ,
      },
      {
        text: 'Отчёт сотрудникам',
        path: '/employee-report',
        module: ModuleNames.FINANCE,
        action: ActionNames.READ,
      },
    ],
  },
  {
    text: 'Водители',
    icon: 'user',
    path: '/drivers',
    module: ModuleNames.DRIVERS,
    action: ActionNames.READ,
  },
  {
    text: 'Сотрудники',
    icon: 'users',
    path: '/employees',
    module: ModuleNames.USERS,
    action: ActionNames.READ,
  },
  {
    text: 'База транспорта',
    icon: 'truck',
    module: ModuleNames.VEHICLES,
    action: ActionNames.READ,
    children: [
      {
        text: 'Тягачи',
        icon: 'truck',
        path: '/transport/trucks',
        module: ModuleNames.VEHICLES,
        action: ActionNames.READ,
      },
      {
        text: 'Прицепы',
        icon: 'truck',
        path: '/transport/trailers',
        module: ModuleNames.VEHICLES,
        action: ActionNames.READ,
      },
      {
        text: 'Доп. транспортные средства',
        icon: 'truck',
        path: '/transport/extra',
        module: ModuleNames.VEHICLES,
        action: ActionNames.READ,
      },
    ],
  },
];

export default navbarData;
