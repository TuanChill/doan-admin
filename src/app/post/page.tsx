'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PostsRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/management/posts');
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <p>Đang chuyển hướng đến trang Quản lý bài viết...</p>
    </div>
  );
}
