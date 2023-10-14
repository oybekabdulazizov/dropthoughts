import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { Analytics } from '@vercel/analytics/react';

import '../globals.css';
import { Inter } from 'next/font/google';

export const metadata: Metadata = {
  title: 'DropThoughts',
  description:
    'The ultimate social networking app designed to share your thoughts  with your closest friends and loved ones like never before.',
};

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang='en'>
        <body
          className={`${inter.className} bg-dark-1 w-[full] h-[100vh] flex justify-center items-center`}
        >
          {children}
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
