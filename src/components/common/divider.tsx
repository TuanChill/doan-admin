import { cn } from '@/lib/utils';

type Props = {
  className?: string;
};

export const Divider = ({ className }: Props) => {
  return <div className={cn('h-[1px] w-full bg-dark-gray-70', className)} />;
};
