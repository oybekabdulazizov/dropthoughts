import { Inter } from 'next/font/google';
import '../globals.css';
import { ClerkProvider } from '@clerk/nextjs';

export const metadata = {
  title: 'Threads Auth',
  description: 'A Next.js 13 Meta Threads App',
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
        </body>
      </html>
    </ClerkProvider>
  );
}
