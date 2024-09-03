import { Inter } from "next/font/google";
import localFont from "next/font/local";
import {SessionProvider} from "next-auth/react";
import { auth } from "@/auth";
import "@/css/globals.css"
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { allFilesRouter } from "@/app/api/uploadthing/core";

const inter = Inter({ subsets: ["latin"] });
export const satoshi = localFont({
  src: [
    {
      path: './fonts/satoshi/Satoshi-Regular.woff',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/satoshi/Satoshi-Medium.woff',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/satoshi/Satoshi-Bold.woff',
      weight: '800',
      style: 'normal',
    },
    {
      path: './fonts/satoshi/Satoshi-Light.woff',
      weight: '200',
      style: 'normal',
    },
  ]
})
export const deroseFont = localFont({
  src: "./fonts/derose/derose-medium.ttf"
})
export const metadata = {
  title: "Admin Panel",
  description: "Landing page for Riverside waters",
};

export default async function RootLayout({ children }) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body className={satoshi.className}>
        <NextSSRPlugin
          routerConfig={extractRouterConfig(allFilesRouter)}
        />
        {children}</body>
      </html>
    </SessionProvider>
  );
}