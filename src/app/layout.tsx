import type { Metadata } from "next";
import { League_Spartan, Unbounded } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers"

const leagueSpartan = League_Spartan({ 
  subsets: ["latin"],
  variable: "--font-league-spartan",
});

const unbounded = Unbounded({ 
  subsets: ["latin"],
  variable: "--font-unbounded",
});

export const metadata: Metadata = {
  title: "TimeScape",
  description: "Project Timeline Management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${leagueSpartan.variable} ${unbounded.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
