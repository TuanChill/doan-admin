'use client';

import { Button } from '@/components/common/button';
import { Input } from '@/components/common/input';
import { InputSelect } from '@/components/common/select';
import { Card } from '@/components/ui/card';
import { useRouter } from '@/hooks/use-router';
import { useState } from 'react';

type PropsFirstTimeLogin = {
  onNext: () => void;
};

type PropsSecondTimeLogin = {
  handleLogin: () => void;
};

const FirstTimeLogin = ({ onNext }: PropsFirstTimeLogin) => {
  return (
    <Card className="flex min-w-[352px] flex-col items-center justify-center p-4">
      <h2 className="text-head-xs mb-4">Set up Binance Wallet</h2>
      <div className="flex w-full flex-col gap-3">
        <Input label="API Key" placeholder="Enter your API Key" />
        <InputSelect
          label="API Secret"
          selectOptions={[]}
          onChange={() => {}}
        />
        <div className="mt-6 grid grid-cols-2 gap-2">
          <Button outlined onClick={onNext}>
            Later
          </Button>
          <Button className="border-dark-gray-50">Login</Button>
        </div>
      </div>
    </Card>
  );
};

const SecondTimeLogin = ({ handleLogin }: PropsSecondTimeLogin) => {
  return (
    <Card className="flex min-w-[352px] flex-col items-center justify-center p-4">
      <h2 className="text-head-xs mb-4">Login</h2>
      <div className="flex w-full flex-col gap-3">
        <Input label="Username" placeholder="Enter your ID" />
        <Input
          label="Password"
          placeholder="Enter your password"
          type="password"
        />
        <Button className="mt-4 border-dark-gray-50" onClick={handleLogin}>
          Login
        </Button>
      </div>
    </Card>
  );
};

export default function Login() {
  const [isFirstTimeLogin, setIsFirstTimeLogin] = useState(true);
  const router = useRouter();

  const handleLogin = () => {
    router.push('/');
  };

  const handleNext = () => {
    setIsFirstTimeLogin(false);
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      {isFirstTimeLogin ? (
        <FirstTimeLogin onNext={handleNext} />
      ) : (
        <SecondTimeLogin handleLogin={handleLogin} />
      )}
    </div>
  );
}
