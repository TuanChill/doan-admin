'use client';

import { useLoadingStore } from '@/stores/loading-store';
import Loader from 'nextjs-toploader';
import { useEffect, useState } from 'react';

export const NextTopLoader = () => {
  const [isShowingNextLoading] = useLoadingStore((state) => [
    state.isShowingNextLoading,
  ]);

  // Add client-side only rendering state
  const [isMounted, setIsMounted] = useState(false);

  // Only show client-rendered content after hydration is complete
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      {isMounted && isShowingNextLoading && (
        <div className="fixed left-0 top-0 z-[100] flex h-full w-full items-center justify-center bg-black/90 text-6xl">
          <div className="flex flex-col items-center">
            <div className="-mt-10 text-2xl font-medium text-white">
              Đang tải...
            </div>
          </div>
        </div>
      )}
      {isMounted && (
        <Loader
          shadow={false}
          height={6}
          showAtBottom
          color="#22D3BB"
          showSpinner={false}
        />
      )}
    </>
  );
};
