import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  weight: ['400', '700', '900'],
});

export const metadata = {
  title: 'Ourios Analytics',
  description: 'Analytics for shipping investors',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-slate-50 dark:bg-black text-slate-900 dark:text-slate-100 transition-colors duration-300`}>
        {children}
      </body>
    </html>
  );
}