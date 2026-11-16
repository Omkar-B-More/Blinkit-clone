import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';

export const metadata: Metadata = {
  title: 'Blinkit: 10-minute Grocery & Instant Delivery Platform',
  description:
    'India pioneered instant delivery model shopping on Blinkit for everything from grocery staples, milk, vegetables to emergency supplies, electronics, and printouts in 10 minutes.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F4F6F8] text-zinc-900 font-sans antialiased selection:bg-yellow-300 selection:text-black">
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
