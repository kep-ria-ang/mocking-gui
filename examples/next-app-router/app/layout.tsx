import ClientMockingDevTools from './Provider';

import './globals.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ClientMockingDevTools>{children}</ClientMockingDevTools>
      </body>
    </html>
  );
}
