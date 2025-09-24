import React from 'react';
import { Button } from '@/components/ui/button';
import { usePermissions } from '@/hooks/usePermissions';
import { IProtectedButtonProps } from './types';


export const ProtectedButton: React.FC<IProtectedButtonProps> = ({
  module,
  action,
  permissions,
  requireAll = false,
  hideWhenNoAccess = false,
  children,
  disabled,
  ...props
}) => {
  const { hasPermission, hasAllPermissions, hasAnyPermission } = usePermissions();

  let hasAccess = false;

  if (permissions && permissions.length > 0) {
    hasAccess = requireAll 
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);
  } else {
    hasAccess = hasPermission(module, action);
  }

  if (!hasAccess && hideWhenNoAccess) {
    return null;
  }

  return (
    <Button 
      {...props} 
      disabled={disabled || !hasAccess}
    >
      {children}
    </Button>
  );
};
