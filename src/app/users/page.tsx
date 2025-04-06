'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function UsersRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/management/users');
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <p>Redirecting to User Management...</p>
    </div>
  );
}
