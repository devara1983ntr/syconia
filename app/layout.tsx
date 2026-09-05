import type { ReactNode } from "react";

import { fraunces, inter } from "./fonts";
import { MotionProvider } from "../lib/motion/provider";
import "./styles/globals.css";

export const metadata = {
  title: "SYCONIA",
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
