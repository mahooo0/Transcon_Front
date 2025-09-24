import useIsMobile from '@/hooks/useIsMobile';
import React, { useEffect, useState } from 'react';
import SideBarLayout from './SideBarLayout';
import { useLocation, useNavigate } from 'react-router-dom';

const SideBarLayoutContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [activePath, setActivePath] = useState('/dashboard');
  const isMobile = useIsMobile();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const handleNavigation = (path: string) => {
    setActivePath(path);
    navigate(path);
  };

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location.pathname]);

  return (
    <SideBarLayout
      isMobile={isMobile}
      isCollapsed={isCollapsed}
      activePath={activePath}
      handleNavigation={handleNavigation}
      setIsMobileSidebarOpen={setIsMobileSidebarOpen}
      isMobileSidebarOpen={isMobileSidebarOpen}
      toggleSidebar={toggleSidebar}
      toggleMobileSidebar={toggleMobileSidebar}
    >
      {children}
    </SideBarLayout>
  );
};

export default SideBarLayoutContainer;
