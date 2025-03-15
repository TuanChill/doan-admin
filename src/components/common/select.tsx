'use client';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type SelectOption = {
  value: string;
  label: string;
};

type Props = {
  label?: string;
  selectOptions: SelectOption[];
  defaultValue?: string;
  isRequired?: boolean;
  disabled?: boolean;
  value?: string;
  placeholder?: string;
  error?: string;
  onChange: (value: string | number) => void;
};

export const InputSelect = ({
  label,
  selectOptions,
  defaultValue,
  isRequired = false,
  placeholder = 'Select',
  disabled = false,
  error,
  onChange,
  value,
}: Props) => {
  return (
    <div className="flex w-full flex-col gap-2">
      {label && (
        <p className="text-dark-gray-05">
          {label} {isRequired && <span className="text-red-500">*</span>}
        </p>
      )}
      <div className="text-body-sm w-full">
        <Select
          onValueChange={onChange}
          disabled={disabled}
          defaultValue={defaultValue}
          value={value}
        >
          <SelectTrigger className="min-h-[40px] w-full rounded-xl border-dark-gray-70 bg-dark-gray-90 px-3 py-2.5 text-dark-gray-40">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent className="!z-[9999] bg-dark-gray-90 text-dark-gray-05">
            <SelectGroup>
              {selectOptions.map((option) => (
                <SelectItem
                  key={option.value}
                  className="hover:!bg-dark-gray-70"
                  value={option.value}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};
