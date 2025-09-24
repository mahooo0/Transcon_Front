import { IPermission } from '@/services/auth/types';
import { ActionNames, ModuleNames } from '@/types/enum';

export interface IProtectedButtonProps {
  children: React.ReactNode;
  disabled?: boolean;
  module: ModuleNames;
  action: ActionNames;
  permissions?: IPermission[];
  requireAll?: boolean;
  hideWhenNoAccess?: boolean;
  className?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'primary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}
