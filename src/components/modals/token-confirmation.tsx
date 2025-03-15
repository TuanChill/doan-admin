'use client';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/common/button';
import type { TokenSearchResult } from '@/types/token';
import { Divider } from '@/components/common/divider';

interface TokenConfirmationProps {
  token: TokenSearchResult;
  onBack: () => void;
  onImport: () => void;
}

export default function TokenConfirmation({
  token,
  onBack,
  onImport,
}: TokenConfirmationProps) {
  return (
    <div className="space-y-6 p-4">
      <div className="text-center">
        <p className="text-body-sm mb-6 text-dark-gray-20">
          Would you like to import this token?
        </p>
        <div className="mb-2 flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-white">
            <Avatar className="size-8">
              <AvatarImage src={''} />
              <AvatarFallback>
                {token.symbol.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="text-left">
            <p className="text-subhead-sm text-dark-gray-05">{token.name}</p>
            <p className="text-body-sm text-dark-gray-30">0 {token.symbol}</p>
            <p className="text-body-sm text-dark-gray-30">$0.00 USD</p>
          </div>
        </div>
      </div>
      <Divider />
      <div className="grid grid-cols-2 gap-2">
        <Button outlined onClick={onBack}>
          Back
        </Button>
        <Button onClick={onImport}>Import</Button>
      </div>
    </div>
  );
}
