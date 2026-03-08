export const metadata = {
  title: 'Herbgarden',
  description: 'Botanical Essence',
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
