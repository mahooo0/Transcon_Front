import { RootState } from '@/redux/store';
import { IPermission } from '@/services/auth/types';
import { ActionNames, ModuleNames } from '@/types/enum';
import { useSelector } from 'react-redux';

export const usePermissions = () => {
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const hasPermission = (module: ModuleNames, action: ActionNames) => {
    if (!isAuthenticated) return false;

    const userPermissions = user.permissions || [];
    return userPermissions.some(
      (perm) => perm.module === module && perm.action === action
    );
  };

  const hasAnyPermission = (permissions: IPermission[]): boolean => {
    return permissions.some(({ module, action }) =>
      hasPermission(module, action)
    );
  };

  const hasAllPermissions = (permissions: IPermission[]): boolean => {
    return permissions.every(({ module, action }) =>
      hasPermission(module, action)
    );
  };

  const hasModuleAccess = (module: ModuleNames): boolean => {
    if (!isAuthenticated || !user.permissions) {
      return false;
    }
    return user.permissions.some(
      (permission: IPermission) => permission.module === module
    );
  };

  const getModulePermissions = (module: ModuleNames): ActionNames[] => {
    if (!isAuthenticated || !user.permissions) {
      return [];
    }

    return user.permissions
      .filter((permission: IPermission) => permission.module === module)
      .map((permission: IPermission) => permission.action as ActionNames);
  };

  const canRead = (module: ModuleNames) =>
    hasPermission(module, ActionNames.READ);
  const canCreate = (module: ModuleNames) =>
    hasPermission(module, ActionNames.CREATE);
  const canUpdate = (module: ModuleNames) =>
    hasPermission(module, ActionNames.UPDATE);
  const canDelete = (module: ModuleNames) =>
    hasPermission(module, ActionNames.DELETE);
  const canExport = (module: ModuleNames) =>
    hasPermission(module, ActionNames.EXPORT);

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasModuleAccess,
    getModulePermissions,
    canRead,
    canCreate,
    canUpdate,
    canDelete,
    canExport,
    userPermissions: user.permissions || [],
    userRole: user.role,
  };
};
