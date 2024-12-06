"use client";
//import type { Metadata } from "next";
//import { Inter } from "next/font/google";
//import "./globals.css";

//import { Analytics } from '@vercel/analytics/react';
import ReactGA from "react-ga4";

import { GA4_TOKEN, GSC_TOKEN, SITE_THEME_COLOR } from "./config";
//const inter = Inter({ subsets: ["latin"] });
ReactGA.initialize(GA4_TOKEN);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      style={{ backgroundColor: SITE_THEME_COLOR, height: "100%" }}
    >
      <head>
        <title>MYGO</title>
        <meta name="google-site-verification" content={GSC_TOKEN} />
      </head>
      <body>{children}</body>
    </html>
  );
}
