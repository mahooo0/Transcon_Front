import Header from '@/components/common/Header';
import Sidebar from '@/components/common/SideBar';
import MobileSidebar from '@/components/common/SideBar/MobileSidebar';
import React from 'react';

interface ISideBarLayoutProps {
  isMobile: boolean;
  isCollapsed: boolean;
  activePath: string;
  children: React.ReactNode;
  handleNavigation: (path: string) => void;
  setIsMobileSidebarOpen: (isOpen: boolean) => void;
  isMobileSidebarOpen: boolean;
  toggleSidebar: () => void;
  toggleMobileSidebar: () => void;
}

const SideBarLayout: React.FC<ISideBarLayoutProps> = ({
  isMobile,
  isCollapsed,
  activePath,
  children,
  handleNavigation,
  setIsMobileSidebarOpen,
  isMobileSidebarOpen,
  toggleSidebar,
  toggleMobileSidebar,
}) => {
  return (
    <>
      <div className="flex h-screen bg-gray-50">
        {!isMobile && (
          <Sidebar
            isCollapsed={isCollapsed}
            activePath={activePath}
            onNavigate={handleNavigation}
          />
        )}

        {isMobile && (
          <MobileSidebar
            isOpen={isMobileSidebarOpen}
            onClose={setIsMobileSidebarOpen}
            activePath={activePath}
            onNavigate={handleNavigation}
          />
        )}

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            onToggleSidebar={toggleSidebar}
            onToggleMobileSidebar={toggleMobileSidebar}
            isMobile={isMobile}
          />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </>
  );
};

export default SideBarLayout;
