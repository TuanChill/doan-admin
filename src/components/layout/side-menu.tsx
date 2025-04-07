/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { APP_URL } from '@/const/routes';
import {
  Bolt,
  Coins,
  FileText,
  LogOut,
  MoreVertical,
  RectangleEllipsis,
  Ticket,
  Users,
  BarChart,
  ChevronLeft,
  ChevronRight,
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
        key: 'dashboard',
        label: 'Thống kê & Báo cáo',
        icon: <BarChart />,
        subItems: [],
        class: '',
        isAllowed: true,
      },
      {
        key: 'users',
        label: 'Người dùng',
        icon: <Users />,
        subItems: [],
        class: '',
        isAllowed: true,
      },
      {
        key: 'posts',
        label: 'Bài viết',
        icon: <FileText />,
        subItems: [
          {
            key: 'posts',
            label: 'Quản lý bài viết',
            class: 'px-4 py-2',
            isAllowed: true,
          },
          {
            key: 'categories',
            label: 'Quản lý danh mục',
            class: 'px-4 py-2',
            isAllowed: true,
          },
          {
            key: 'tags',
            label: 'Quản lý thẻ tag',
            class: 'px-4 py-2',
            isAllowed: true,
          },
        ],
        class: '',
        isAllowed: true,
      },
      {
        key: 'tickets',
        label: 'Vé',
        icon: <Ticket />,
        subItems: [],
        class: '',
        isAllowed: true,
      },
      {
        key: 'exhibits',
        label: 'Hiện vật',
        icon: <Coins />,
        subItems: [
          {
            key: 'exhibits',
            label: 'Quản lý hiện vật',
            class: 'px-4 py-2',
            isAllowed: true,
          },
          {
            key: 'category-artifacts',
            label: 'Quản lý loại hiện vật',
            class: 'px-4 py-2',
            isAllowed: true,
          },
        ],
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

  const isMenuActive = (menuItem: MenuItem) => {
    // For main menu items without subitems
    if (pathname === `/management/${menuItem.key}`) {
      return true;
    }

    // For menu items with subitems, check if any submenu is active
    if (menuItem.subItems && menuItem.subItems.length > 0) {
      return menuItem.subItems.some(
        (subItem) => pathname === `/management/${subItem.key}`
      );
    }

    return false;
  };

  const isSubMenuActive = (subItemKey: string) => {
    return pathname === `/management/${subItemKey}`;
  };

  const isMenuExpanded = (menuItem: MenuItem) => {
    // If the current path is a submenu of this menu item, keep it expanded
    if (menuItem.subItems && menuItem.subItems.length > 0) {
      return menuItem.subItems.some(
        (subItem) => pathname === `/management/${subItem.key}`
      );
    }
    return false;
  };

  useEffect(() => {
    if (pathname.includes('/management/')) {
      const pathAfterManagement = pathname.split('/management/')[1];
      if (pathAfterManagement) {
        // Find if this is a submenu
        for (const menuItem of menuItems) {
          const subItem = menuItem.subItems.find(
            (s) => s.key === pathAfterManagement
          );
          if (subItem) {
            setCurrentTab(subItem.label);
            return;
          }
        }

        // If not a submenu, set the main menu label
        setCurrentTab(
          menuItems.find((item) => item.key === pathAfterManagement)?.label ||
            ''
        );
      }
    }
  }, [pathname, menuItems]);

  return (
    isClient && (
      <div
        className={cn(
          'flex h-full flex-col border-r border-dark-gray-70 bg-dark-gray-80'
        )}
      >
        <div className="grow overflow-y-auto text-white">
          {!isShowing && (
            <div className="flex h-max items-center justify-center px-4 py-3">
              <span className="text-lg font-medium">HT</span>
            </div>
          )}
          {isShowing && (
            <div className="flex items-center justify-between rounded-sm bg-gradient-to-r from-dark-gray-70 to-dark-gray-80 px-4 py-3 font-medium tracking-wide text-white shadow-sm">
              <div className="flex items-center gap-3">
                <span className="truncate text-lg transition-colors duration-200 hover:text-light-blue-40">
                  Hệ thống quản lý bảo tàng
                </span>
              </div>
            </div>
          )}
          <Divider />
          <ul className="px-2 py-3">
            {menuItems
              .filter((menuItem) => menuItem.isAllowed)
              .map((menuItem) => {
                return (
                  <li
                    key={menuItem.key}
                    onClick={() =>
                      menuItem.subItems.length === 0 &&
                      handleItemClick(menuItem.key, menuItem.path)
                    }
                    className={cn(
                      isMenuActive(menuItem) &&
                        menuItem.subItems.length === 0 &&
                        'rounded-l-lg border-r-[4px] border-light-blue-40 bg-[#363637]',
                      menuItem.class +
                        ' mt-2 cursor-pointer hover:rounded-lg hover:bg-dark-gray-70'
                    )}
                  >
                    {menuItem.subItems.length > 0 ? (
                      <details open={isMenuExpanded(menuItem)}>
                        <summary
                          className={cn(
                            'text-gray-0 flex items-center justify-between px-2 py-3 font-semibold after:!text-gray-300',
                            !isShowing && 'after:hidden',
                            menuItem.subItems.length === 0 && 'after:hidden',
                            isMenuActive(menuItem) && 'text-light-blue-40'
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
                                      isSubMenuActive(subItem.key)
                                        ? 'rounded-md bg-blue-500 font-medium text-white'
                                        : 'transition-colors hover:bg-dark-gray-70 hover:text-white',
                                      subItem.class
                                    )}
                                    onClick={() => handleItemClick(subItem.key)}
                                  >
                                    <a className="block w-full">
                                      {subItem.label}
                                    </a>
                                  </li>
                                );
                              })}
                          </ul>
                        )}
                      </details>
                    ) : (
                      <div
                        className={cn(
                          'text-gray-0 flex items-center px-2 py-3 font-semibold'
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
                      </div>
                    )}
                  </li>
                );
              })}
          </ul>
        </div>
        <Divider />
        <div className="overflow-y-auto px-4">
          {!isShowing && (
            <div className="flex w-full flex-col items-center gap-2">
              <div className="bg-blue-8000 flex h-[25px] w-[25px] min-w-[25px] items-center justify-center rounded-full text-xs text-white">
                Aa
              </div>
            </div>
          )}
          {isShowing && (
            <div className="flex flex-col gap-4">
              <Dropdown
                data={actions}
                hoverHighlight={false}
                className="!dropdown-top !dropdown-content"
                interClassName="absolute left-20 bottom-20"
              >
                <div className="flex items-center gap-x-5 overflow-hidden rounded-lg bg-dark-gray-70 p-4">
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
            </div>
          )}
        </div>
      </div>
    )
  );
};
