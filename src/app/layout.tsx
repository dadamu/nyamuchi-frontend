"use client";
//import type { Metadata } from "next";
//import { Inter } from "next/font/google";
//import "./globals.css";

import { Analytics } from '@vercel/analytics/react';
import ReactGA from 'react-ga';
//const inter = Inter({ subsets: ["latin"] });
ReactGA.initialize("G-RZRPMDK12F")
ReactGA.pageview(window.location.pathname + window.location.search)

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{backgroundColor:"rgb(51, 129, 175)", height:"100%"}}>
      <title>MYGO</title>
      <body>{children}
        <Analytics/>
      </body>
    </html>
  );
}
