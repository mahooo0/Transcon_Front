import { Sheet, SheetContent } from '@/components/ui/sheet';
import SidebarContent from '../SidebarContent';
import { IMobileSidebarProps } from '../types';

const MobileSidebar = ({
  isOpen,
  onClose,
  activePath,
  onNavigate,
}: IMobileSidebarProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-80 p-0 bg-gradient-to-b from-slate-50 to-white border-r border-slate-200/60">
        <div className="h-full">
          <SidebarContent
            activePath={activePath}
            onNavigate={onNavigate}
            onClose={() => onClose(false)}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
