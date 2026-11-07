"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  ["/", "Home"],
  ["/add-expense", "Add Expense"],
  ["/expenses", "Expenses"],
  ["/reports", "Reports"],
  ["/insights", "Insights"],
  ["/health", "Health Check"],
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <div className="flex flex-wrap gap-1 text-sm">
      {LINKS.map(([href, label]) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={`px-3 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-accent/40 ${
              isActive ? "bg-accentSoft text-accent font-medium" : "hover:bg-accentSoft hover:text-accent"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
