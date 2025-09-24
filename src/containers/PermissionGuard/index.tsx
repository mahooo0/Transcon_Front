import { usePermissions } from '@/hooks/usePermissions';
import { IPermissionGuardProps } from './types';

export const PermissionGuard: React.FC<IPermissionGuardProps> = ({
  module,
  action,
  children,
  fallback = null,
  requireAll = false,
  permissions,
}) => {
  const { hasPermission, hasAllPermissions, hasAnyPermission } =
    usePermissions();

  let hasAccess = false;

  if (permissions && permissions.length > 0) {
    hasAccess = requireAll
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);
  } else {
    hasAccess = hasPermission(module, action);
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>;
};
