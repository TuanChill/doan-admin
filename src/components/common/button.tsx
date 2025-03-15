'use client';
import { cn } from '@/lib/utils';
import classNames from 'clsx';
import Image from 'next/image';
import React, { PropsWithChildren, ReactNode } from 'react';

type Props = {
  textColor?: string;
  backgroundColor?: string;
  className?: string;
  innerClassName?: string;
  primary?: boolean;
  disabled?: boolean;
  outlined?: boolean;
  loading?: boolean;
  urlIcon?: string;
  iconClassName?: string;
  iconElement?: ReactNode;
  onClick?: () => void;
  wide?: boolean;
  highlight?: boolean;
  [key: string]: unknown;
};

export const Button = ({
  disabled,
  innerClassName,
  className,
  outlined,
  primary = true,
  urlIcon,
  iconClassName,
  loading,
  wide,
  children,
  onClick,
  iconElement,
  ...rest
}: PropsWithChildren<Props>) => {
  const classes = cn(
    'flex items-center justify-center text-center text-subhead-sm rounded-lg text-dark-gray-05 px-4 py-2.5',
    loading || disabled ? 'cursor-default opacity-70' : '',
    outlined && '!bg-dark-gray-80 !border !border-dark-gray-50',
    wide && 'w-full',
    primary && 'bg-light-blue-50 border border-light-blue-60',
    className
  );

  const handleOnClick = () => {
    onClick?.();
  };

  return (
    <button
      onClick={handleOnClick}
      type="button"
      disabled={disabled || loading}
      className={classes}
      {...rest}
    >
      <div
        className={classNames(
          'flex w-full items-center justify-center overflow-hidden rounded-xl',
          innerClassName
        )}
      >
        {loading ? (
          <span
            className={classNames(
              'inline-block h-6 w-6 animate-spin rounded-full border-[3px] border-current border-t-transparent'
            )}
            role="status"
            aria-label="loading"
          />
        ) : (
          <div className="flex items-center justify-center">
            {urlIcon && (
              <Image
                className={classNames('mr-2', iconClassName)}
                src={urlIcon}
                width={16}
                height={16}
                alt="button icon"
              />
            )}
            {iconElement}
            {children}
          </div>
        )}
      </div>
    </button>
  );
};
