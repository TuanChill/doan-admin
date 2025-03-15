import { MoreVertical } from 'lucide-react';
import type { TokenData } from '@/types/token';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface TokenCardProps {
  token: TokenData;
}

export default function TokenCard({ token }: TokenCardProps) {
  const TokenIcon = () => {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-500 text-white">
        <Avatar>
          <AvatarImage src={token.icon} />
          <AvatarFallback className="bg-dark-gray-70 text-white">
            ?
          </AvatarFallback>
        </Avatar>
      </div>
    );
  };

  return (
    <div className="rounded-2xl border border-dark-gray-70 bg-dark-gray-80 p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <TokenIcon />
          <div>
            <div className="text-subhead-xs text-dark-gray-20">
              {token.name}
            </div>
            <div className="text-head-xs">{token.symbol}</div>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Remove</DropdownMenuItem>
            <DropdownMenuItem>View Details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-2">
        <div>
          <div className="text-labe-caption text-dark-gray-20">
            Network address
          </div>
          <div className="text-subhead-md">{token.networkAddress}</div>
        </div>
        <div>
          <div className="text-labe-caption text-dark-gray-20">
            Current balance on Binance
          </div>
          <div className="text-subhead-md">{token.balance}</div>
        </div>
      </div>
    </div>
  );
}
