'use client';

import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CustomTokenData } from '@/types/token';
import { Input } from '@/components/common/input';

interface CustomTokenTabProps {
  customToken: CustomTokenData;
  setCustomToken: (token: CustomTokenData) => void;
  onNext: () => void;
}

export default function CustomTokenTab({
  customToken,
  setCustomToken,
  onNext,
}: CustomTokenTabProps) {
  const updateCustomToken = (field: keyof CustomTokenData, value: string) => {
    setCustomToken({
      ...customToken,
      [field]: value,
    });
  };

  const isNextDisabled = !customToken.contractAddress || !customToken.symbol;

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center space-x-3 rounded-md border-l-[4px] border-[#D14B62] bg-[#37050D] p-3">
        <AlertTriangle
          className="mt-0.5 h-5 w-5 flex-shrink-0"
          color="#C41230"
        />
        <div className="text-subhead-sm text-dark-gray-05">
          Anyone can create a token, including creating fake versions of
          existing tokens. Learn about
          <br />
          <a href="#" className="text-light-blue-40 hover:underline">
            Scams and Security Risks
          </a>
        </div>
      </div>

      <Input
        label="Token contract address"
        value={customToken.contractAddress}
        onChange={(value) => updateCustomToken('contractAddress', value)}
        placeholder="Enter contract address"
        className="border-gray-700 bg-gray-800 text-white"
      />

      {customToken.contractAddress && (
        <>
          <Input
            label="Token symbol"
            value={customToken.symbol}
            onChange={(value) => updateCustomToken('symbol', value)}
            placeholder="USDT"
            className="border-gray-700 bg-gray-800 text-white"
          />

          <Input
            label="Token decimal"
            value={customToken.decimal || ''}
            onChange={(value) => updateCustomToken('decimal', value)}
            placeholder="6"
            className="border-gray-700 bg-gray-800 text-white"
          />
        </>
      )}

      <Button
        onClick={onNext}
        disabled={isNextDisabled}
        className="w-full bg-blue-600 text-white hover:bg-blue-700"
      >
        Next
      </Button>
    </div>
  );
}
