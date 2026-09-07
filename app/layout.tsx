import type { Metadata } from "next";
import type { ReactNode } from "react";

import { fraunces, inter } from "./fonts";
import { MotionProvider } from "../lib/motion/provider";
import "./styles/globals.css";

/**
 * Document icons (M1-T005): the official pack favicon set, wired exactly
 * per branding/README.md §Favicon configuration — /favicon.ico is the
 * conventional legacy+modern root request (a byte-identical public copy
 * of ASSET-FAV-004), 32/16 PNG follow the same convention, and the
 * apple-touch icon is ASSET-ICON-003. /manifest.webmanifest is generated
 * from app/manifest.ts and linked automatically by the App Router.
 */
export const metadata: Metadata = {
  title: "SYCONIA",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/branding/favicon/syconia-favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/branding/favicon/syconia-favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: {
      url: "/branding/app-icon/syconia-app-icon-180.png",
      sizes: "180x180",
      type: "image/png",
    },
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
