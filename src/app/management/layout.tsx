'use client';

import MenuLayout from '@/components/layout/menu-layout';
import { useUserStore } from '@/stores/user-store';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function layout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useUserStore();

  useEffect(() => {
    if (!isAuthenticated()) {
      redirect('/login');
    }
  }, [isAuthenticated()]);

  return (
    <>
      <MenuLayout>{children}</MenuLayout>
    </>
  );
}
