import React from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { ActionNames, ModuleNames } from '@/types/enum';
import { IPermission } from '@/services/auth/types';

interface ConditionalRenderProps {
  children: React.ReactNode;
  module?: ModuleNames;
  action?: ActionNames;
  permissions?: IPermission[];
  requireAll?: boolean;
  role?: string;
  customCondition?: boolean;
}

export const ConditionalRender: React.FC<ConditionalRenderProps> = ({
  children,
  module,
  action,
  permissions,
  requireAll = false,
  role,
  customCondition,
}) => {
  const { 
    hasPermission, 
    hasAllPermissions, 
    hasAnyPermission, 
    userRole 
  } = usePermissions();

  let shouldRender = true;

  if (customCondition !== undefined) {
    shouldRender = customCondition;
  }
  else if (role) {
    shouldRender = userRole === role;
  }
  else if (permissions && permissions.length > 0) {
    shouldRender = requireAll 
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);
  }
  else if (module && action) {
    shouldRender = hasPermission(module, action);
  }

  return shouldRender ? <>{children}</> : null;
};