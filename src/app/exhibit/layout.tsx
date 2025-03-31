export const metadata = {
    title: 'Quản lý hiện vật',
    description: 'Quản lý hiện vật',
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