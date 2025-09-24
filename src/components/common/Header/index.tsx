import { getUserRole } from '@/helpers';
import { persistor, RootState } from '@/redux/store';
import { useAppSelector } from '@/redux/typeHooks';
import { UserRole } from '@/types/enum';
import { Menu, MoreVertical, LogOut, User as UserIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useDispatch } from 'react-redux';
import { logout } from '@/redux/slices/auth/auth.slice';
import AuthService from '@/services/auth';

interface IHeaderProps {
  onToggleSidebar: () => void;
  onToggleMobileSidebar: () => void;
  isMobile: boolean;
}
const Header = ({
  onToggleSidebar,
  onToggleMobileSidebar,
  isMobile,
}: IHeaderProps) => {
  const dispatch = useDispatch();
  const { user } = useAppSelector((state: RootState) => state.auth);

  const handleLogout = async () => {
    await AuthService.logout();
    dispatch(logout());
    persistor.purge();
  };
  return (
    <header className="h-16 bg-gradient-to-r from-white to-slate-50 border-b border-slate-200/60 flex items-center justify-between px-6 shadow-lg shadow-slate-200/20 backdrop-blur-sm">
      {/* Left side - Menu button */}
      <div className="flex items-center gap-4">
        <button
          onClick={isMobile ? onToggleMobileSidebar : onToggleSidebar}
          className="p-2.5 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-800 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Right side - User info */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2.5 rounded-xl shadow-lg shadow-blue-500/25">
          {/* User Avatar */}
          <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
            <UserIcon className="w-4 h-4 text-white" />
          </div>

          {/* User Info */}
          <div className="text-sm hidden sm:block">
            <div className="font-semibold text-white">{user.fullName}</div>
            <div className="text-blue-100 text-xs">
              {getUserRole(user.role as UserRole)}
            </div>
          </div>

          {/* Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1.5 hover:bg-white/20 rounded-lg transition-all duration-200 hover:scale-105">
                <MoreVertical className="w-4 h-4 text-white" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 bg-white/95 backdrop-blur-sm border border-slate-200/60 shadow-xl"
            >
              <DropdownMenuItem className="flex items-center gap-3 p-3 hover:bg-slate-50">
                <UserIcon className="w-4 h-4 text-slate-500" />
                <div>
                  <div className="font-medium text-slate-900">
                    {user.fullName}
                  </div>
                  <div className="text-xs text-slate-500">
                    {getUserRole(user.role as UserRole)}
                  </div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-200" />
              <DropdownMenuItem
                onClick={handleLogout}
                className="flex items-center gap-3 p-3 text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-medium">Выйти</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
