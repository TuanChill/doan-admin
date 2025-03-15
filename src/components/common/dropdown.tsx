import { Divider } from '@/components/common/divider';
import { cn } from '@/lib/utils';
import React, { PropsWithChildren, useRef, useState } from 'react';

export type MenuOption = {
  className?: string;
  interClassName?: string;
  icon?: React.ReactNode;
  label: string;
  isFileInput?: boolean;
  isMultiple?: boolean;
  onClick?: () => void;
  onFileChange?: (files: FileList | null) => void;
  inputType?: 'file' | 'folder';
  acceptType?: string;
  divider?: boolean;
  needEditPermission?: boolean;
  checkRoot?: boolean;
};

export const MenuItem = ({
  icon,
  label,
  onClick,
  className,
  isFileInput = false,
  isMultiple = false,
  inputType = 'file',
  acceptType = '.pdf',
  onFileChange,
}: MenuOption) => {
  const inputFile = useRef(null);
  const BASE_CLASSES =
    'cursor-pointer py-2 px-3 hover:bg-blue-5 flex items-center gap-x-2';
  const inputOptions =
    inputType === 'file'
      ? {}
      : {
          directory: '',
          webkitdirectory: '',
        };

  const handleOnClick = () => {
    if (isFileInput) {
      (inputFile.current! as HTMLInputElement).value = '';
      (inputFile.current! as HTMLInputElement).click();
    } else {
      onClick?.();
    }
  };

  const handleOnFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    event.preventDefault();
    const files = event.target.files;

    onFileChange?.(files);
  };

  return (
    <div onClick={handleOnClick} className={cn(BASE_CLASSES, className)}>
      {icon}
      {label}
      <input
        type="file"
        id="file"
        ref={inputFile}
        style={{ display: 'none' }}
        multiple={isMultiple}
        onChange={handleOnFileChange}
        accept={acceptType}
        {...inputOptions}
      />
    </div>
  );
};

export const Dropdown = ({
  data,
  children,
  onClick,
  hoverHighlight = true,
  className,
  interClassName,
}: PropsWithChildren<{
  data: MenuOption[];
  onClick?: () => void;
  hoverHighlight?: boolean;
  className?: string;
  interClassName?: string;
}>) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (option: MenuOption) => {
    setIsOpen(false);
    option.onClick?.();
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (!isOpen) onClick?.();
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={cn('dropdown dropdown-bottom dropdown-end', className)}
      tabIndex={0}
      role="button"
    >
      <div
        onClick={handleMenuClick}
        className={cn('cursor-pointer', hoverHighlight && 'hover:bg-blue-5')}
      >
        {children}
      </div>

      {isOpen && (
        <ul
          tabIndex={0}
          className={cn(
            'dropdown-content z-50 w-52 overflow-hidden rounded-lg bg-dark-gray-70 p-0 !text-white shadow-xl',
            interClassName
          )}
        >
          {data.map((option) => (
            <div key={option.label}>
              {option.divider && <Divider />}
              <MenuItem
                icon={option.icon}
                label={option.label}
                onClick={() => handleOptionClick(option)}
                onFileChange={option.onFileChange}
                isFileInput={option.isFileInput}
                isMultiple={option.isMultiple}
                className={option.className}
                inputType={option.inputType}
              ></MenuItem>
            </div>
          ))}
        </ul>
      )}
    </div>
  );
};
