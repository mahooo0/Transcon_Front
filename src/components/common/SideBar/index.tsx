import SidebarContent from './SidebarContent';

interface SidebarProps {
  isCollapsed: boolean;
  activePath: string;
  onNavigate: (path: string) => void;
}

const Sidebar = ({ isCollapsed, activePath, onNavigate }: SidebarProps) => {
  return (
    <div
      className={`${isCollapsed ? 'w-16' : 'w-80'} h-full bg-gradient-to-b from-slate-50 to-white border-r border-slate-200/60 shadow-lg shadow-slate-200/20 flex flex-col transition-all duration-300 ease-in-out backdrop-blur-sm`}
    >
      <SidebarContent
        activePath={activePath}
        onNavigate={onNavigate}
        isCollapsed={isCollapsed}
      />
    </div>
  );
};

export default Sidebar;
