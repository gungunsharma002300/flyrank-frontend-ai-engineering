import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Link Preview Tool — FE-07",
  description: "Structured tool output demo built with the Vercel AI SDK",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col" style={{ background: "var(--bg)" }}>
        {children}
      </body>
    </html>
  );
}
