'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TicketsRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/management/tickets');
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <p>Đang chuyển hướng đến trang Quản lý vé...</p>
    </div>
  );
}
