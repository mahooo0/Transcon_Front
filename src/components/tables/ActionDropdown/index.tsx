import { TableAction } from '@/types';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ActionsDropdownProps {
  actions: TableAction[];
  //todo: fix this
  onRowClick?: (row: any) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
  row: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

const ActionsDropdown: React.FC<ActionsDropdownProps> = ({
  actions,
  onRowClick,
  row,
}) => {
  const handleActionClick = (action: TableAction) => {
    action.onClick(row);
  };

  return (
    <DropdownMenu
      onOpenChange={(open) => {
        if (open) {
          if (onRowClick) onRowClick(row);
        }
      }}
    >
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="p-1 text-gray-400 cursor-pointer hover:text-gray-600"
        >
          <MoreHorizontal size={16} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48" align="end">
        {actions.map((action) => (
          <DropdownMenuItem
            key={action.label}
            onClick={() => handleActionClick(action)}
            className={`
              text-gray-700
              ${action.variant === 'danger' ? 'text-red-700 focus:bg-red-50' : ''}
              ${action.variant === 'success' ? 'text-green-700 focus:bg-green-50' : ''}
            `}
          >
            {action.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ActionsDropdown;
