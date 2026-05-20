import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  weight: ['400', '700', '900'], // Peso 900 es clave para el título
});

export const metadata = {
  title: 'Aegis Maritime Intelligence',
  description: 'Advanced Data for the Maritime Economy',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-black transition-colors duration-300`}>
        {children}
      </body>
    </html>
  );
}