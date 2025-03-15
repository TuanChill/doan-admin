import MenuLayout from '@/components/layout/menu-layout';
import { TokenProvider } from '@/hoc/token-provider';

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TokenProvider>
        <MenuLayout>{children}</MenuLayout>
      </TokenProvider>
    </>
  );
}
