'use client';
import { cn } from '@/lib/utils';
import { CircleAlert, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import React, { ReactNode, useEffect, useRef, useState } from 'react';

type Props = {
  value?: string | number;
  defaultValue?: string;
  type?: string;
  customInputClassNames?: string;
  customClassNames?: string;
  error?: string;
  placeholder?: string;
  clearable?: boolean;
  checkable?: boolean;
  hiddenValidate?: boolean;
  iconElement?: ReactNode;
  unitRefit?: string;
  // eslint-disable-next-line no-unused-vars
  onChange?: (value: string | number) => void;
  onBlur?: () => void;
  readOnly?: boolean;
  [key: string]: unknown;
};
const BASE_CLASS =
  'w-full border border-dark-gray-60 bg-dark-gray-80 px-3 py-2 outline-none min-h-[40px] flex items-center rounded-lg text-body-sm';
const BASE_INPUT_CLASS =
  'mr-2 w-full text-body-sm outline-none bg-transparent !text-dark-gray-40';
export const CommonInput = ({
  value,
  error,
  type = 'text',
  onChange,
  placeholder,
  onBlur,
  customInputClassNames,
  customClassNames,
  clearable,
  checkable,
  hiddenValidate,
  readOnly = false,
  iconElement,
  defaultValue,
  ...rest
}: Props) => {
  const [showPassword, setshowPassword] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    if (onChange) {
      onChange(newVal);
    }
  };
  const handleOnBlur = () => {
    if (onBlur) {
      onBlur();
    }
    if (inputRef.current) {
      inputRef.current.classList.add('border-grey-200');
      inputRef.current.classList.remove('!border-20');
      if (!error) {
        inputRef.current.classList.remove('!border-b');
      }
    }
  };
  const handleShowPassword = () => {
    setshowPassword((prev) => !prev);
  };
  const handleClearValue = () => {
    if (onChange) {
      onChange('');
    }
  };
  const handleFocus = () => {
    if (inputRef.current) {
      inputRef.current.classList.remove('border-grey-200');
      inputRef.current.classList.add('!border-1');
      inputRef.current.classList.add('!border-grey-200');
    }
  };

  useEffect(() => {
    if (defaultValue) onChange?.(defaultValue);
  }, [defaultValue, onChange]);

  return (
    <>
      <div
        ref={inputRef}
        className={cn(
          BASE_CLASS,
          readOnly && 'bg-white',
          error &&
            'border-b-1 !border-[#DE1135] text-sm focus:!border-[#DE1135]',
          // value &&
          // "border-lightBlue-500 border-2",
          // !error &&
          customClassNames
        )}
      >
        <div className="flex w-full items-center font-bold">
          <input
            type={showPassword ? 'text' : type}
            lang="en-US"
            className={cn(
              BASE_INPUT_CLASS,
              customInputClassNames,
              readOnly && 'bg-white'
            )}
            // style={{ color: "black !important" }}
            placeholder={placeholder || ''}
            value={value}
            onChange={handleOnChange}
            onBlur={handleOnBlur}
            onFocus={handleFocus}
            readOnly={readOnly}
            defaultValue={defaultValue}
            {...rest}
          />
          {iconElement && iconElement}
          {(value || Number(value) > 0) && !error && !checkable && (
            <button
              type="button"
              className={cn('mr-2', hiddenValidate && 'hidden')}
            ></button>
          )}
          {(value || Number(value) > 0) && clearable && (
            <button
              type="button"
              onClick={handleClearValue}
              className={cn(type === 'password' && 'mr-2')}
            >
              <Image
                src="/icons/clear-circle.svg"
                alt="warning"
                height={20}
                width={20}
              />
            </button>
          )}
          {type === 'password' && (
            <button type="button" onClick={handleShowPassword}>
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )}
        </div>
      </div>
      {error && (
        <div className="flex items-center gap-x-1.5">
          {/* <Image
            src="/icons/warning-circle.svg"
            alt="warning"
            height={20}
            width={20}
            className="mt-1.5"
          /> */}
          <CircleAlert size={20} className="mt-1.5" />
          <p className="mt-2 self-start text-sm text-[#DE1135]">{error}</p>{' '}
        </div>
      )}
    </>
  );
};
