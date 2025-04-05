/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { APP_URL } from '@/const/routes';
import {
  Bolt,
  Coins,
  LogOut,
  MoreVertical,
  RectangleEllipsis,
  Wallet,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import { useRouter } from '@/hooks/use-router';
import { Divider } from '@/components/common/divider';
import { cn } from '@/lib/utils';
import { Dropdown } from '@/components/common/dropdown';
import { get } from 'lodash';
import { useUserStore } from '@/stores/user-store';
import { ComboboxCoin } from '@/components/common/comboboxCoin';
import { useLayoutStore } from '@/stores/use-layout-store';

interface MenuItem {
  key: string;
  label: string;
  icon: ReactNode;
  subItems: { key: string; label: string; class: string; isAllowed: boolean }[];
  class: string;
  isAllowed?: boolean;
  path?: string;
}
type Props = {
  isShowing: boolean;
  onArrowClick: () => void;
};
export const SideMenu = ({ isShowing, onArrowClick }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const { setCurrentTab } = useLayoutStore();
  const [user, logout] = useUserStore((state: any) => [
    state.user,
    state.logout,
  ]);

  const handleLogout = () => {
    logout();
    router.push(APP_URL.LOGIN);
    // showSuccess("Thành công", "Đăng xuất thành công");
  };

  const menuItems: MenuItem[] = useMemo(() => {
    return [
      {
        key: 'users',
        label: 'Người dùng',
        icon: <Users />,
        subItems: [],
        class: '',
        isAllowed: true,
      },
      {
        key: 'exhibits',
        label: 'Hiện vật',
        icon: <Coins />,
        subItems: [],
        class: '',
        isAllowed: true,
      },
      {
        key: 'invoices',
        label: 'Hoá đơn',
        icon: <Bolt />,
        subItems: [],
        class: '',
        isAllowed: true,
      },
    ];
  }, []);

  const handleItemClick = (itemKey: string, itemPath?: string) => {
    if (itemPath) {
      router.push(itemPath);
      return;
    }

    setCurrentTab(itemKey);
    router.push(`/management/${itemKey}`);
  };

  const actions = [
    {
      icon: <RectangleEllipsis size={20} />,
      label: 'Change password',
      onClick: handleLogout,
      className: 'h-10 gap-2 p-2',
    },
    {
      icon: <LogOut size={20} color="#D93E2D" />,
      label: 'Logout',
      onClick: handleLogout,
      className: 'text-[#D93E2D] p-2 hover:bg-red-50',
    },
  ];
  const handleArrowClick = () => {
    onArrowClick?.();
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (pathname.includes('/management/')) {
      const pathAfterManagement = pathname.split('/management/')[1];
      if (pathAfterManagement) {
        setCurrentTab(
          menuItems.find((item) => item.key === pathAfterManagement)?.label ||
            ''
        );
      }
    }
  }, [pathname]);

  return (
    isClient && (
      <div
        className={cn(
          'flex h-full flex-col border-r border-dark-gray-70 bg-dark-gray-80'
        )}
      >
        <div className="grow overflow-y-auto text-white">
          {!isShowing && (
            <div
              className="flex h-max items-center justify-center px-4 py-3"
              onClick={handleArrowClick}
            >
              <Image
                src="/images/logo/governance.png"
                width={25}
                height={25}
                alt=""
              />
            </div>
          )}
          {isShowing && (
            <div className="flex items-center justify-between px-4 py-3 text-white">
              <ComboboxCoin
                coins={[
                  {
                    id: '1',
                    name: 'Bitcoin',
                    symbol: 'BTC',
                    image:
                      'https://boolean-dev.s3.ap-southeast-1.amazonaws.com/BTC.png',
                  },
                ]}
                defaultValue="Bitcoin"
                onChange={() => {}}
              />
            </div>
          )}
          <Divider />
          <ul className="px-2 py-3">
            {menuItems
              .filter((menuItem) => menuItem.isAllowed)
              .map((menuItem) => {
                const isActive =
                  pathname === (menuItem.path || '/management/' + menuItem.key);
                return (
                  <li
                    key={menuItem.key}
                    onClick={() =>
                      menuItem.subItems.length === 0 &&
                      handleItemClick(menuItem.key, menuItem.path)
                    }
                    className={cn(
                      isActive &&
                        'rounded-l-lg border-r-[4px] border-light-blue-40 bg-[#363637]',
                      menuItem.class +
                        ' mt-2 cursor-pointer hover:rounded-lg hover:bg-dark-gray-70'
                    )}
                  >
                    {menuItem.subItems ? (
                      <details
                        open={
                          !!menuItem.subItems.find(
                            (e) => '/' + e.key == pathname
                          )
                        }
                      >
                        <summary
                          className={cn(
                            'text-gray-0 flex items-center justify-between px-2 py-3 font-semibold after:!text-gray-300',
                            !isShowing && 'after:hidden',
                            menuItem.subItems.length === 0 && 'after:hidden'
                          )}
                        >
                          <div className="text-gray-0 flex items-center gap-4">
                            {menuItem.icon}
                            {isShowing && (
                              <div className="text-subhead-sm">
                                {menuItem.label}
                              </div>
                            )}
                          </div>
                        </summary>
                        {isShowing && (
                          <ul className="text-gray-40">
                            {menuItem.subItems
                              .filter((item) => item.isAllowed)
                              .map((subItem) => {
                                return (
                                  <li
                                    key={subItem.key}
                                    className={cn(
                                      pathname === '/' + subItem.key &&
                                        'text-gray-10 rounded-md bg-blue-500 text-white',
                                      subItem.class
                                    )}
                                    onClick={() => handleItemClick(subItem.key)}
                                  >
                                    <a>{subItem.label}</a>
                                  </li>
                                );
                              })}
                          </ul>
                        )}
                      </details>
                    ) : (
                      <div className="text-gray-0 flex items-center gap-3 px-3">
                        {menuItem.icon}
                        <summary className="text-sm font-medium">
                          {isShowing && (
                            <div className="text-sm font-medium">
                              {menuItem.label}
                            </div>
                          )}
                        </summary>
                      </div>
                    )}
                  </li>
                );
              })}
          </ul>
        </div>
        <Divider />
        {!isShowing && (
          <div className="w-full px-4 py-3 text-white">
            <div className="bg-blue-8000 flex h-[25px] w-[25px] min-w-[25px] items-center justify-center rounded-full text-xs text-white">
              Aa
            </div>
          </div>
        )}
        {isShowing && (
          <Dropdown
            data={actions}
            hoverHighlight={false}
            className="!dropdown-top !dropdown-content"
            interClassName="absolute left-20 bottom-20"
          >
            <div className="flex items-center gap-x-5 overflow-hidden p-4">
              <div className="flex w-full items-center gap-3">
                <div className="bg-blue-8000 flex h-[36px] w-[36px] min-w-[36px] items-center justify-center rounded-full text-white">
                  Aa
                </div>
                <div>
                  <div className="text-md grow text-start font-medium text-white">
                    {get(user, 'username')}
                  </div>
                  <div className="text-md grow text-start font-medium text-gray-400">
                    {get(user, 'email')}
                  </div>
                </div>
              </div>
              <MoreVertical size={24} className="text-gray-400" />
            </div>
          </Dropdown>
        )}
      </div>
    )
  );
};
