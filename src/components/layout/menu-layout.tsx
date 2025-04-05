'use client';

import { SideMenu } from '@/components/layout/side-menu';
import { ReactNode, useState } from 'react';
import { useLayoutStore } from '@/stores/use-layout-store';
import { PanelLeft } from 'lucide-react';
type Props = {
  children: ReactNode;
};

const MenuLayout = ({ children }: Props) => {
  const [showMenu, setShowMenu] = useState(true);

  const { currentTab } = useLayoutStore();

  const handleMenu = () => {
    setShowMenu((prev) => !prev);
  };

  return (
    // <UserProvider>
    <div className="flex h-screen flex-col overflow-hidden">
      {/* header */}
      <div className="flex h-full w-full !bg-transparent">
        <div
          className={`transition-all duration-300 ease-in-out ${
            showMenu ? 'w-[280px] min-w-[280px]' : 'w-[63px] min-w-[63px]'
          } flex flex-col`}
        >
          <SideMenu isShowing={showMenu} onArrowClick={handleMenu} />
        </div>

        <div className="relative h-full w-full">
          {/* header title */}
          <div className="flex h-[69px] justify-between border-b border-dark-gray-70 bg-dark-gray-80 px-6 py-4">
            <div className="flex items-center gap-[24px]">
              <div className="cursor-pointer rounded-lg border border-dark-gray-60 bg-dark-gray-70 p-2.5">
                <PanelLeft size={24} />
              </div>
              <h2 className="text-head-sm">{currentTab}</h2>
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
