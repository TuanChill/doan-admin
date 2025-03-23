export const metadata = {
  title: 'Quản lý bài viết',
  description: 'Quản lý bài viết',
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
