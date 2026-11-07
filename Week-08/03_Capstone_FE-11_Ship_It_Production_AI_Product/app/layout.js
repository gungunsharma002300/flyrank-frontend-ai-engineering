import "./globals.css";
import Link from "next/link";
import NavLinks from "../components/NavLinks";
import StorageWarning from "../components/StorageWarning";

export const metadata = {
  title: "Expense Tracker",
  description:
    "Track daily expenses, categories, monthly reports, and get AI-generated spending insights.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-accent focus:text-white focus:px-4 focus:py-2 focus:rounded-lg"
        >
          Skip to content
        </a>
        <header className="border-b border-line bg-card sticky top-0 z-10">
          <nav className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3 px-4 py-4">
            <Link href="/" className="font-display font-bold text-lg tracking-tight">
              💰 Expense Tracker
            </Link>
            <NavLinks />
          </nav>
        </header>
        <StorageWarning />
        <main id="main-content" className="max-w-5xl mx-auto px-4 py-10">
          {children}
        </main>
      </body>
    </html>
  );
}
