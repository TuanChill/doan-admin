'use client';

import { SideMenu } from '@/components/layout/side-menu';
import { ReactNode, useState, useEffect } from 'react';
import { useLayoutStore } from '@/stores/use-layout-store';
import { PanelLeft, PanelRightClose } from 'lucide-react';
import { cn } from '@/lib/utils';
type Props = {
  children: ReactNode;
};

const MenuLayout = ({ children }: Props) => {
  const [showMenu, setShowMenu] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { currentTab } = useLayoutStore();

  // Handle mobile responsiveness
  useEffect(() => {
    const checkWindowSize = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);
      if (isMobileView && showMenu) {
        setShowMenu(false);
      }
    };

    // Check on first load
    checkWindowSize();

    // Listen for window resize events
    window.addEventListener('resize', checkWindowSize);

    // Clean up
    return () => window.removeEventListener('resize', checkWindowSize);
  }, [showMenu]);

  const handleMenu = () => {
    setShowMenu((prev) => !prev);
  };

  return (
    // <UserProvider>
    <div className="flex h-screen flex-col overflow-hidden">
      {/* header */}
      <div className="flex h-full w-full !bg-transparent">
        <div
          className={cn(
            'transition-all duration-300 ease-in-out',
            showMenu ? 'w-[280px] min-w-[280px]' : 'w-[63px] min-w-[63px]',
            'flex flex-col'
          )}
        >
          <SideMenu isShowing={showMenu} onArrowClick={handleMenu} />
        </div>

        <div className="relative h-full w-full">
          {/* header title */}
          <div className="flex h-[69px] justify-between border-b border-dark-gray-70 bg-dark-gray-80 px-6 py-4">
            <div className="flex items-center gap-[24px]">
              <div
                className="cursor-pointer rounded-lg border border-dark-gray-60 bg-dark-gray-70 p-2.5 transition-colors hover:bg-dark-gray-60"
                onClick={handleMenu}
              >
                {showMenu ? (
                  <PanelRightClose size={24} className="text-gray-200" />
                ) : (
                  <PanelLeft size={24} className="text-gray-200" />
                )}
              </div>
              <h2 className="text-head-sm text-white">{currentTab}</h2>
            </div>
          </div>
          <main className="h-full w-full overflow-y-auto !bg-transparent">
            {children}
          </main>
        </div>
      </div>
    </div>
    // </UserProvider>
  );
};

export default MenuLayout;
