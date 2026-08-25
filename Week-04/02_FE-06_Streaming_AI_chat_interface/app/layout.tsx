import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StreamMate — FE-06",
  description: "Streaming AI chat interface built for the Frontend AI Engineering FE-06 assignment.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
