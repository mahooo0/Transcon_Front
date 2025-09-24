import { usePermissions } from '@/hooks/usePermissions';
import { useState } from 'react';
import { SidebarItemProps } from '../types';
import {
  ChevronDown,
  ChevronRight,
  Home,
  Folder,
  FileText,
  CreditCard,
  DollarSign,
  Users,
  User,
  Settings,
  Truck,
  Car,
  ClipboardList,
  TrendingUp,
  Building2,
  Package,
} from 'lucide-react';

const SidebarItem = ({
  item,
  activePath,
  onClick,
  level = 0,
  isCollapsed,
  onClose,
}: SidebarItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { hasPermission } = usePermissions();

  const hasAccess =
    item.module && item.action ? hasPermission(item.module, item.action) : true;

  if (!hasAccess) return null;

  const hasChildren = item.children && item.children.length > 0;
  const hasVisibleChildren =
    hasChildren &&
    item.children?.some((child) =>
      child.module && child.action
        ? hasPermission(child.module, child.action)
        : true
    );

  const handleClick = () => {
    if (hasVisibleChildren && !isCollapsed) {
      setIsExpanded(!isExpanded);
    } else if (item.path) {
      console.log('Navigating to:', item.path);
      onClick(item.path);
      if (onClose) onClose();
    }
  };

  const getIcon = (iconName: string) => {
    const icons = {
      home: Home,
      folder: Folder,
      'file-text': FileText,
      'credit-card': CreditCard,
      'dollar-sign': DollarSign,
      users: Users,
      user: User,
      settings: Settings,
      truck: Truck,
      car: Car,
      'clipboard-list': ClipboardList,
      'trending-up': TrendingUp,
      'building-2': Building2,
      package: Package,
    } as const;

    const IconComponent = icons[iconName as keyof typeof icons] || Home;
    return <IconComponent className="w-5 h-5" />;
  };

  const isActive = activePath === item.path;
  const isActiveSection = isExpanded && hasVisibleChildren;

  return (
    <div className="w-full mb-1">
      <div
        className={`group flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-3 py-3 cursor-pointer transition-all duration-200 rounded-lg mx-1 ${
          isActive
            ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/25'
            : isActiveSection
              ? 'bg-blue-50 text-blue-700 border border-blue-200'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800 hover:shadow-sm'
        } ${level > 0 && !isCollapsed ? 'ml-4' : ''}`}
        onClick={handleClick}
        title={isCollapsed ? item.text : undefined}
      >
        <div
          className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}
        >
          <div
            className={`transition-colors duration-200 ${
              isActive
                ? 'text-white'
                : isActiveSection
                  ? 'text-blue-600'
                  : 'text-slate-500 group-hover:text-slate-700'
            }`}
          >
            {getIcon(item.icon || 'home')}
          </div>

          {!isCollapsed && (
            <span
              className={`text-sm font-medium transition-colors duration-200 ${
                isActive
                  ? 'text-white font-semibold'
                  : isActiveSection
                    ? 'text-blue-700 font-semibold'
                    : 'text-slate-600 group-hover:text-slate-800'
              }`}
            >
              {item.text}
            </span>
          )}
        </div>
        {hasVisibleChildren && !isCollapsed && (
          <div className="ml-2">
            {isExpanded ? (
              <ChevronDown
                className={`w-4 h-4 transition-colors duration-200 ${
                  isActive
                    ? 'text-white'
                    : isActiveSection
                      ? 'text-blue-600'
                      : 'text-slate-400 group-hover:text-slate-600'
                }`}
              />
            ) : (
              <ChevronRight
                className={`w-4 h-4 transition-colors duration-200 ${
                  isActive
                    ? 'text-white'
                    : isActiveSection
                      ? 'text-blue-600'
                      : 'text-slate-400 group-hover:text-slate-600'
                }`}
              />
            )}
          </div>
        )}
      </div>

      {hasVisibleChildren && isExpanded && !isCollapsed && (
        <div className="bg-slate-50/50 rounded-lg mx-1 mt-1 overflow-hidden">
          {item.children?.map((child, index) => (
            <SidebarItem
              key={index}
              item={child}
              activePath={activePath}
              onClick={onClick}
              level={level + 1}
              isCollapsed={isCollapsed}
              onClose={onClose}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SidebarItem;
