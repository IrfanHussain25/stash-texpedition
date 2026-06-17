import { Inter } from 'next/font/google';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
  title: 'TeXpedition Stash',
  description: 'AI-powered passive product discovery agent',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="font-sans antialiased">
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
