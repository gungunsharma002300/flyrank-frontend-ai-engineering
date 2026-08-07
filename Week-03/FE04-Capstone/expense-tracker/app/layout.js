import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Expense Tracker",
  description: "Track daily expenses, categories, and monthly reports.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-line bg-card sticky top-0 z-10">
          <nav className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3 px-4 py-4">
            <Link href="/" className="font-display font-bold text-lg tracking-tight">
              💰 Expense Tracker
            </Link>
            <div className="flex flex-wrap gap-1 text-sm">
              {[
                ["/", "Home"],
                ["/add-expense", "Add Expense"],
                ["/expenses", "Expenses"],
                ["/reports", "Reports"],
                ["/health", "Health Check"],
              ].map(([href, label]) => (
                <Link
                  key={href}
                  href={href}
                  className="px-3 py-2 rounded-lg hover:bg-accentSoft hover:text-accent transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>
          </nav>
        </header>
        <main className="max-w-5xl mx-auto px-4 py-10">{children}</main>
      </body>
    </html>
  );
}
