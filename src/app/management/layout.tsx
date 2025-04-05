import MenuLayout from '@/components/layout/menu-layout';

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MenuLayout>{children}</MenuLayout>
    </>
  );
}
