import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Studio | Production-ready demo",
  description: "A minimal AI chat application with server-side secrets and API abuse controls."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}