'use client';

import { useTokenStore } from '@/stores/use-token-store';
import { ReactNode, useEffect } from 'react';

type Props = {
  children: ReactNode;
};

const tokens = [
  {
    id: 'btc',
    name: 'Bitcoin',
    symbol: 'BTC',
    icon: 'bitcoin',
    networkAddress: '0x4e4cd52sd...f06e',
    balance: '1.04549358',
  },
  {
    id: 'eth',
    name: 'Ethereum',
    symbol: 'ETH',
    icon: 'ethereum',
    networkAddress: '0x4e4cd52sd...f06e',
    balance: '1.04549358',
  },
  {
    id: 'xrp',
    name: 'Ripple',
    symbol: 'XRP',
    icon: 'ripple',
    networkAddress: '0x4e4cd52sd...f06e',
    balance: '1.04549358',
  },
];

export const TokenProvider = ({ children }: Props) => {
  const { setTokens } = useTokenStore();

  useEffect(() => {
    setTokens(tokens);
  }, []);

  return children;
};
