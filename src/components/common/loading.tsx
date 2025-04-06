'use client';

import { useLoadingStore } from '@/stores/loading-store';
import clsx from 'clsx';
import React from 'react';

export const Loading = () => {
  const [isShowing, content] = useLoadingStore((state) => [
    state.isShowing,
    state.content,
  ]);

  return (
    isShowing && (
      <div className="fixed left-0 top-0 z-[100] flex h-full w-full items-center justify-center bg-black/90 text-6xl">
        <div className="flex flex-col items-center justify-center">
          <div
            className="inline-block h-14 w-14 animate-spin rounded-full border-[3px] border-current border-t-transparent text-white/80"
            role="status"
            aria-label="loading"
          />
          {content && (
            <div className="-mt-10 text-2xl font-medium text-white">
              {content}
            </div>
          )}
        </div>
      </div>
    )
  );
};

type Props = {
  size?: number;
  className?: string;
  color?: string;
};

export const LoadingSpinner = ({
  size = 20,
  className,
  color = 'black',
}: Props) => {
  return (
    <span
      className={clsx(
        className,
        'inline-block animate-spin rounded-full border-[3px] border-current border-t-transparent text-white/80'
      )}
      role="status"
      aria-label="loading"
      style={{
        width: size + 'px',
        height: size + 'px',
        color: color,
      }}
    />
  );
};
