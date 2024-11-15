"use client";
//import type { Metadata } from "next";
//import { Inter } from "next/font/google";
//import "./globals.css";

import { Analytics } from '@vercel/analytics/react';
import ReactGA from 'react-ga4';
//const inter = Inter({ subsets: ["latin"] });
ReactGA.initialize("G-RZRPMDK12F");

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{backgroundColor:"#3381AF", height:"100%"}}>
      <title>MYGO</title>
      <body>{children}
        <Analytics/>
      </body>
    </html>
  );
}
