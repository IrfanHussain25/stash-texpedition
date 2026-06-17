import { Outfit } from 'next/font/google';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './globals.css';
import Navbar from '@/components/Navbar';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata = {
  title: 'Stash',
  description: 'AI-powered passive product discovery agent',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={outfit.variable}>
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${outfit.className} antialiased`}>
        <Navbar />
        {children}
        <ToastContainer 
          position="bottom-right" 
          theme="dark" 
          toastClassName="bg-[#12121a] border border-white/10 text-white shadow-2xl rounded-xl"
        />
      </body>
    </html>
  );
}
