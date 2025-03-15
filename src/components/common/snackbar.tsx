'use client';
import { SnackbarTypes, useSnackBarStore } from '@/stores/snackbar-store';
import { AlertCircle, AlertTriangle, CheckCircle2, X } from 'lucide-react';
import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';

const BASE_CLASSES =
  'inset-x-0 mx-auto w-fit rounded-md p-4 hs-removing:translate-x-10 hs-removing:opacity-0 fixed z-[999] transition-all duration-5000 ease-in-out';

export const SnackBar: React.FC = () => {
  const [isShowing, message, title, type, isLastMessage, close] =
    useSnackBarStore((state) => [
      state.isShowing,
      state.message,
      state.title,
      state.type,
      state.isLastMessage,
      state.close,
    ]);

  useEffect(() => {
    const interval = setInterval(close, isLastMessage ? 15000 : 10000);
    return () => clearInterval(interval);
  }, [isLastMessage, close]);

  const SNACKBAR_ICON = (type: SnackbarTypes) => {
    switch (type) {
      case SnackbarTypes.error:
        return <AlertCircle color="#FD2F7A" size={16} />;
      case SnackbarTypes.success:
        return <CheckCircle2 color="#22D3BB" size={16} />;
      default:
      case SnackbarTypes.warning:
        return <AlertTriangle color="#F7931A" size={16} />;
    }
  };

  const SNACKBAR_COLOR = (type: SnackbarTypes) => {
    switch (type) {
      case SnackbarTypes.error:
        return 'bg-[#410018] text-sm text-white';
      case SnackbarTypes.success:
        return 'bg-[#003A32] text-sm text-white';
      default:
      case SnackbarTypes.warning:
        return 'bg-[#502C00] text-sm text-white';
    }
  };

  const icon = SNACKBAR_ICON(type);
  const snackClass = SNACKBAR_COLOR(type);

  return (
    isShowing && (
      <div
        className={cn(
          BASE_CLASSES,
          isShowing ? 'top-5' : '-top-[400px]',
          snackClass
        )}
      >
        <div
          className={cn(
            'flex h-full w-full max-w-[calc(100vw-32px)] items-start justify-between'
          )}
        >
          <div className="mt-1 w-4">{icon}</div>
          <div className={cn('ml-3')}>
            {title && <div className="text-base font-semibold">{title}</div>}
            {message && (
              <div className="mt-1 text-wrap break-words">{message}</div>
            )}
          </div>
          <div className="ml-3">
            <button
              type="button"
              onClick={close}
              className="inline-flex cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
              data-hs-remove-element="#dismiss-alert"
            >
              <X color="white" size={16} className="mt-1" />
            </button>
          </div>
        </div>
      </div>
    )
  );
};
