import { Outlet } from 'react-router-dom';
import SideBarLayoutContainer from '../SideBarLayout';

const RootLayout = () => {
  return (
    <SideBarLayoutContainer>
      <Outlet />
    </SideBarLayoutContainer>
  );
};

export default RootLayout;
