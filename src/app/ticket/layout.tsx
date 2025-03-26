export const metadata = {
    title: 'Quản lý vé',
    description: 'Quản lý vé',
  }
  
  export default function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <html lang="en">
        <body>{children}</body>
      </html>
    )
  }