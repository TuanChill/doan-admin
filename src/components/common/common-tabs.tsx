import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { TabsEnum } from '@/types/cex';
import { ReactNode } from 'react';

export type TabData = {
  value: string;
  label: string;
  content: ReactNode;
};

type Pops = {
  tabsData: TabData[];
  onValueChange: (value: TabsEnum) => void;
};

export const CommonTabs = ({ tabsData, onValueChange }: Pops) => {
  const handleTabChange = (value: string) => {
    onValueChange(value as TabsEnum);
  };

  return (
    <Tabs
      defaultValue={tabsData[0].value}
      className="flex h-full w-full flex-col"
      onValueChange={handleTabChange}
    >
      <TabsList className="relative flex w-full justify-start rounded-none !bg-dark-gray-80 p-0 pl-6">
        {tabsData.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className={cn(
              'text-subhead-sm relative z-10 rounded-none border-x border-t-2 border-x-transparent border-t-transparent bg-transparent px-4 py-2 text-dark-gray-40',
              'data-[state=active]:border-b-2 data-[state=active]:border-b-light-blue-50 data-[state=active]:bg-dark-gray-80 data-[state=active]:text-dark-gray-05 data-[state=active]:shadow-none'
            )}
          >
            {tab.label}
          </TabsTrigger>
        ))}
        <div className="absolute -bottom-[1px] left-0 h-[1px] w-full bg-dark-gray-70"></div>
      </TabsList>
      <div className="flex-1">
        {tabsData.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            {tab.content}
          </TabsContent>
        ))}
      </div>
    </Tabs>
  );
};
