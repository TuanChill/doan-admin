'use client';

import { cn } from '@/lib/utils';
import React, { useState } from 'react';

interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  errorMessage?: string;
  value?: string | number;
  onChange?: (val: string) => void;
}

export const Input: React.FC<InputProps> = ({
  label,
  errorMessage = 'Invalid input',
  required,
  minLength,
  pattern,
  disabled,
  value,
  onChange,
  onBlur,
  className,
  ...props
}) => {
  const [error, setError] = useState('');

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const val = typeof value === 'string' ? value.trim() : '';

    if (required && !val) {
      setError('This field is required');
    } else if (minLength && val.length < minLength) {
      setError(`Must be at least ${minLength} characters`);
    } else if (pattern && !new RegExp(pattern).test(val)) {
      setError(errorMessage);
    } else {
      setError('');
    }

    onBlur?.(e); // Call parent onBlur if provided
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <div className="flex w-full flex-col space-y-2">
      {label && <label className="font-medium">{label}</label>}
      <input
        {...props} // Spread all other attributes
        value={value}
        onChange={handleOnChange}
        onBlur={handleBlur}
        disabled={disabled}
        style={{ boxShadow: '0px 1px 2px 0px rgba(10, 13, 20, 0.03)' }}
        className={cn(
          'text-body-sm h-[40px] !rounded-xl !border border-dark-gray-70 bg-dark-gray-90 px-3 py-2.5 text-dark-gray-40 outline-none transition',
          {
            'border-red-500': error,
            'cursor-not-allowed bg-dark-gray-70': disabled,
            '!bg-[#06060C]': !disabled,
          },
          className
        )}
      />
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
};
