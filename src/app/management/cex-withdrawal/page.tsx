'use client';

import { CommonTabs, TabData } from '@/components/common/common-tabs';
import { TabsEnum } from '@/types/cex';
import { ContentExecute } from '@/components/cex-withdrawal/content-execute';
import { ContentHistory } from '@/components/cex-withdrawal/content-history';
import { ContentGeneralConfig } from '@/components/cex-withdrawal/content-general-config';
import { ContentWalletConfig } from '@/components/cex-withdrawal/content-wallet-config';

export default function CexWithdrawalPage() {
  const tabsData: TabData[] = [
    {
      value: TabsEnum.EXECUTE,
      label: 'Execute',
      content: <ContentExecute />,
    },
    {
      value: TabsEnum.HISTORY,
      label: 'History',
      content: <ContentHistory />,
    },
    {
      value: TabsEnum.GENERATE_CONFIG,
      label: 'Generate Config',
      content: <ContentGeneralConfig />,
    },
    {
      value: TabsEnum.WALLET_CONFIG,
      label: 'Wallet Config',
      content: <ContentWalletConfig />,
    },
  ];

  return <CommonTabs tabsData={tabsData} onValueChange={() => {}} />;
}
