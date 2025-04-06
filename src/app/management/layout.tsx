'use client';

import MenuLayout from '@/components/layout/menu-layout';
import { useUserStore } from '@/stores/user-store';
import { redirect } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated()) {
      redirect('/login');
    }
  }, [isAuthenticated]);

  return (
    <>
      <MenuLayout>{children}</MenuLayout>
    </>
  );
}
