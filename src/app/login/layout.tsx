'use client';

import { useUserStore } from '@/stores/user-store';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useUserStore();

  useEffect(() => {
    if (isAuthenticated()) {
      redirect('/management/users');
    }
  }, [isAuthenticated()]);

  return <>{children}</>;
}
