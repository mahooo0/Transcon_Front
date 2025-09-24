import { INavItem } from '@/data/navbarData';

export interface SidebarItemProps {
  item: INavItem;
  activePath: string;
  onClick: (path: string) => void;
  level?: number;
  isCollapsed: boolean;
  onClose: () => void;
}

export interface ISidebarContentProps {
  activePath: string;
  onNavigate: (path: string) => void;
  isCollapsed?: boolean;
  onClose?: () => void;
}


export interface IMobileSidebarProps {
  isOpen: boolean;
  onClose: (value: boolean) => void;
  activePath: string;
  onNavigate: (path: string) => void;
}