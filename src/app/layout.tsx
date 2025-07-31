import { Inter } from "next/font/google";
import { DeepgramContextProvider } from "./context/DeepgramContextProvider";
import { MicrophoneContextProvider } from "./context/MicrophoneContextProvider";

import "./globals.css";
import type { Metadata } from "next";
import { Roboto_Flex } from 'next/font/google';


const inter = Inter({ subsets: ["latin"] });

const robotoFlex = Roboto_Flex({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-flex',
  weight: ['100', '300', '400', '500', '700', '900'], // elige según necesites
});

export const metadata: Metadata = {
  title: "Dentrix AI Scribe demo",
  description: "Real-time speech-to-text with AI summary",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  userScalable: false,
  viewportFit: 'cover'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={robotoFlex.variable}>
      <body className={`h-full ${inter.className}`}>
        <MicrophoneContextProvider>
          <DeepgramContextProvider>
            {children}
          </DeepgramContextProvider>
        </MicrophoneContextProvider>
      </body>
    </html>
  );
}
