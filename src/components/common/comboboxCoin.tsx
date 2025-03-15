import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Check, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
interface ICoin {
  id: string;
  name: string;
  symbol: string;
  image: string;
}

type Props = {
  coins: ICoin[];
  defaultValue: string;
  onChange: (value: string) => void;
};

export const ComboboxCoin = ({ coins, defaultValue, onChange }: Props) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue);

  const handleSelect = (currentValue: string) => {
    const newValue = currentValue === value ? '' : currentValue;
    setValue(newValue);
    setOpen(false);
    onChange(newValue);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          role="combobox"
          aria-expanded={open}
          className="h-[44px] w-full justify-between rounded-lg border border-dark-gray-60 bg-dark-gray-70"
        >
          <div className="flex items-center gap-3">
            <Image
              src={
                coins.find((coin) => coin.name === value)?.image ||
                '/default-image.png'
              }
              alt={
                coins.find((coin) => coin.name === value)?.name ||
                'default alt text'
              }
              width={20}
              height={20}
            />
            <div className="flex flex-col items-start">
              <span className="text-label-caption">
                {value
                  ? coins.find((coin) => coin.name === value)?.name
                  : 'Select'}
              </span>
              <span className="text-subhead-sm">
                {value
                  ? coins.find((coin) => coin.name === value)?.symbol
                  : 'Select'}
              </span>
            </div>
          </div>
          <ChevronDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="border-dark-gray-60 p-0 text-white">
        <Command className="!border-none !bg-dark-gray-70 text-white">
          <CommandInput placeholder="Search" className="h-9 text-white" />
          <CommandList>
            <CommandEmpty>No coin found.</CommandEmpty>
            <CommandGroup>
              {coins.map((coin) => (
                <CommandItem
                  key={coin.id}
                  value={coin.name}
                  onSelect={handleSelect}
                  className="!bg-transparent !text-white"
                >
                  <div className="flex items-center gap-2">
                    <Image
                      src={coin.image}
                      alt={coin.name}
                      width={20}
                      height={20}
                    />
                    <div className="flex flex-col items-start">
                      <span className="text-label-caption">{coin.name}</span>
                      <span className="text-subhead-sm">{coin.symbol}</span>
                    </div>
                  </div>
                  <Check
                    className={cn(
                      'ml-auto',
                      value === coin.name ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
