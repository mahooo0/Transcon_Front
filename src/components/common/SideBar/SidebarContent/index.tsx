import navbarData from '@/data/navbarData';
import { ISidebarContentProps } from '../types';
import SidebarItem from '../SideBarItem';
import { Truck } from 'lucide-react';
import { useAppSelector } from '@/redux/typeHooks';
import { RootState } from '@/redux/store';
import { ActionNames } from '@/types/enum';

const SidebarContent = ({
  activePath,
  onNavigate,
  isCollapsed = false,
  onClose,
}: ISidebarContentProps) => {
  const { user } = useAppSelector((state: RootState) => state.auth);

  // Функция для проверки прав доступа к модулю
  const hasPermission = (module: string, action: string = ActionNames.READ) => {
    return user.permissions.some(
      (permission) =>
        permission.module === module && permission.action === action
    );
  };

  // Функция для фильтрации навигационных элементов
  const filterNavItems = (items: typeof navbarData) => {
    return items.filter((item) => {
      // Если у элемента нет модуля и действия, показываем его
      if (!item.module || !item.action) {
        return true;
      }

      // Проверяем права доступа к основному элементу
      const hasMainPermission = hasPermission(item.module, item.action);

      // Если есть дочерние элементы, фильтруем их тоже
      if (item.children && item.children.length > 0) {
        const filteredChildren = item.children.filter((child) => {
          if (!child.module || !child.action) return true;
          return hasPermission(child.module, child.action);
        });

        // Показываем родительский элемент только если есть хотя бы один доступный дочерний
        return hasMainPermission && filteredChildren.length > 0;
      }

      return hasMainPermission;
    });
  };

  const filteredNavData = filterNavItems(navbarData);

  return (
    <>
      {/* Header with Logo */}
      <div className="p-2 border-b border-slate-200/60 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="flex items-center justify-center">
          <div
            className={`w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg`}
          >
            <div className={`text-white font-bold text-xl`}>
              <Truck className="w-5 h-5" />
            </div>
          </div>
          {!isCollapsed && (
            <div className="ml-3">
              <h1 className="text-white font-bold text-base">TransCon</h1>
              <p className="text-blue-100 text-xs">Transport Management</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto">
        <div className={`${isCollapsed ? 'py-2 px-1' : 'py-6 px-3'}`}>
          {filteredNavData.map((item, index) => (
            <SidebarItem
              key={index}
              item={item}
              activePath={activePath}
              onClick={onNavigate}
              isCollapsed={isCollapsed}
              onClose={onClose ?? (() => {})}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default SidebarContent;
