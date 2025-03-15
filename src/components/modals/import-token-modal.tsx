'use client';

import { useState } from 'react';
import { X, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type {
  TokenData,
  TokenSearchResult,
  CustomTokenData,
} from '@/types/token';
import CustomTokenTab from '@/components/modals/custom-token-tab';
import TokenConfirmation from '@/components/modals/token-confirmation';
import SearchTokenTab from '@/components/modals/search-token-tab';

interface ImportTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (token: TokenData) => void;
}

export default function ImportTokenModal({
  isOpen,
  onClose,
  onImport,
}: ImportTokenModalProps) {
  const [step, setStep] = useState<'search' | 'custom' | 'confirmation'>(
    'search'
  );
  const [activeTab, setActiveTab] = useState<'search' | 'custom'>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<TokenSearchResult[]>([
    {
      id: 'btc1',
      name: 'BlackrockTradingCurrency',
      symbol: 'BTC',
      icon: 'bitcoin',
    },
    {
      id: 'btc2',
      name: 'BlackrockTradingCurrency',
      symbol: 'BTC',
      icon: 'bitcoin',
    },
    {
      id: 'btc3',
      name: 'BlackrockTradingCurrency',
      symbol: 'BTC',
      icon: 'bitcoin',
    },
    {
      id: 'btc4',
      name: 'BlackrockTradingCurrency',
      symbol: 'BTC',
      icon: 'bitcoin',
    },
  ]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedTokens, setSelectedTokens] = useState<TokenSearchResult[]>([]);
  const [customToken, setCustomToken] = useState<CustomTokenData>({
    contractAddress: '',
    symbol: '',
    decimal: '',
  });
  const [tokenToConfirm, setTokenToConfirm] =
    useState<TokenSearchResult | null>(null);

  if (!isOpen) return null;

  const handleTabChange = (value: string) => {
    setActiveTab(value as 'search' | 'custom');
    setStep(value as 'search' | 'custom');
  };

  const handleSearchNext = () => {
    const selected = searchResults.filter((r) => r.selected);
    if (selected.length > 0) {
      setSelectedTokens(selected);
      setTokenToConfirm(selected[0]);
      setStep('confirmation');
    }
  };

  const handleCustomNext = () => {
    if (customToken.contractAddress && customToken.symbol) {
      const newToken: TokenSearchResult = {
        id: Date.now().toString(),
        name: customToken.symbol,
        symbol: customToken.symbol,
        icon: 'custom',
      };
      setTokenToConfirm(newToken);
      setStep('confirmation');
    }
  };

  const handleImport = () => {
    if (tokenToConfirm) {
      const newToken: TokenData = {
        id: tokenToConfirm.id,
        name: tokenToConfirm.name,
        symbol: tokenToConfirm.symbol,
        icon: tokenToConfirm.icon,
        networkAddress: customToken.contractAddress || '0x4e4cd52sd...f06e',
        balance: '0.00000000',
      };
      onImport(newToken);
      setStep('search');
    }
  };

  const handleBack = () => {
    setStep(activeTab);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-gray-80 bg-opacity-50">
      <div className="relative w-full max-w-md rounded-2xl border border-dark-gray-60 bg-dark-gray-80">
        <div className="flex items-center justify-center p-4">
          <h2 className="text-head-xs text-center">Import Token</h2>
          <Button
            size="icon"
            onClick={onClose}
            className="absolute right-2 hover:bg-dark-gray-70"
          >
            <X className="h-5 w-5" />
          </Button>
          {step === 'confirmation' && (
            <Button
              size="icon"
              onClick={handleBack}
              className="absolute left-2 hover:bg-dark-gray-70"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
        </div>
        {step === 'search' || step === 'custom' ? (
          <Tabs
            defaultValue={activeTab}
            onValueChange={handleTabChange}
            className="w-full bg-transparent"
          >
            <TabsList className="text-subhead-sm grid w-full grid-cols-2 bg-transparent">
              <TabsTrigger
                value="search"
                className="rounded-none border-b-2 border-dark-gray-70 !bg-transparent py-2.5 text-dark-gray-05 data-[state=active]:border-light-blue-40 data-[state=active]:text-light-blue-40"
              >
                Search
              </TabsTrigger>
              <TabsTrigger
                value="custom"
                className="rounded-none border-b-2 border-dark-gray-70 !bg-transparent py-2.5 text-dark-gray-05 data-[state=active]:border-light-blue-40 data-[state=active]:text-light-blue-40"
              >
                Custom Token
              </TabsTrigger>
            </TabsList>
            <TabsContent value="search">
              <SearchTokenTab
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                searchResults={searchResults}
                setSearchResults={setSearchResults}
                onNext={handleSearchNext}
              />
            </TabsContent>
            <TabsContent value="custom">
              <CustomTokenTab
                customToken={customToken}
                setCustomToken={setCustomToken}
                onNext={handleCustomNext}
              />
            </TabsContent>
          </Tabs>
        ) : (
          <TokenConfirmation
            token={tokenToConfirm!}
            onBack={handleBack}
            onImport={handleImport}
          />
        )}
      </div>
    </div>
  );
}
