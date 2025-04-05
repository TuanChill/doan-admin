import { cn } from '@/lib/utils';
import React, { PropsWithChildren, ReactNode } from 'react';

type Props = {
  id?: string;
  drawerContent?: ReactNode;
  toggleDrawer?: () => void;
  drawerOpen?: boolean;
  isPersist?: boolean;
};

export const Drawer = ({
  id,
  children,
  drawerContent,
  drawerOpen,
  toggleDrawer,
  isPersist = false,
}: PropsWithChildren<Props>) => {
  return (
    <div className="drawer drawer-end h-full">
      <input
        id={id}
        type="checkbox"
        className="drawer-toggle"
        checked={drawerOpen}
        onChange={toggleDrawer}
      />
      <div className="drawer-content relative h-full overflow-y-auto">
        {/* Page content here */}
        {children}
      </div>
      <div className="drawer-side z-50">
        {!isPersist ? (
          <label
            htmlFor={id}
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
        ) : (
          <div className="drawer-overlay !cursor-default"></div>
        )}
        <div
          className={cn(
            'menu bg-gray-5 text-base-content flex min-h-full min-w-[424px] flex-col overflow-y-auto !px-0 !py-0'
          )}
        >
          {/* Sidebar content here */}
          {drawerContent}
        </div>
      </div>
    </div>
  );
};
