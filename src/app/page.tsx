'use client';

import { APP_URL } from '@/const/routes';
import { useRouter } from '@/hooks/use-router';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (router) {
      router.push(APP_URL.LOGIN);
    }
  });
}
