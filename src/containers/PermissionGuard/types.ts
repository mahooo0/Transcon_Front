import { IPermission } from "@/services/auth/types";
import { ActionNames, ModuleNames } from "@/types/enum";

export interface IPermissionGuardProps {
  module: ModuleNames;
  action: ActionNames;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireAll?: boolean;
  permissions?: IPermission[];
}