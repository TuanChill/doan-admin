import type { Metadata } from 'next';
import './globals.css';

import Head from 'next/head';
import NextTopLoader from 'nextjs-toploader';
import { SnackBar } from '@/components/common/snackbar';
import { Loading } from '@/components/common/loading';

export const metadata: Metadata = {
  title: 'Admin - Bảo tàng LSQS Việt Nam',
  description: 'Bảo tàng LSQS Việt Nam',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="icon" href="/favico.ico" sizes="84x84" />
      </Head>
      <body
        className={`h-screen overflow-hidden bg-background text-white antialiased`}
      >
        <NextTopLoader />
        {children}
        <Loading />
        <SnackBar />
      </body>
    </html>
  );
}
