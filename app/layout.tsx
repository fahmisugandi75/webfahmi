import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { Inter } from 'next/font/google';
import { Providers } from './providers';

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Fahmi Sugandi",
  description: "The fastest way to build apps with Next.js and Supabase",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
