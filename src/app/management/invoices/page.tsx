'use client';

import { Button } from '@/components/common/button';
import { Input } from '@/components/common/input';
import { InputSelect } from '@/components/common/select';
import { Card } from '@/components/ui/card';

export default function BinanceConfigPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <Card className="flex min-w-[352px] flex-col items-center justify-center p-4">
        <h2 className="text-head-xs mb-4">Set up Binance Wallet</h2>
        <div className="flex w-full flex-col gap-3">
          <Input label="API Key" placeholder="Enter your API Key" />
          <InputSelect
            label="API Secret"
            selectOptions={[]}
            onChange={() => {}}
          />
          <div className="mt-6 flex justify-between gap-2">
            <Button outlined onClick={() => {}}>
              Later
            </Button>
            <Button className="border-dark-gray-50">Confirm</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
