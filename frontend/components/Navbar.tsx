"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`text-sm font-medium transition-colors ${
        isActive
          ? "text-brand-primary"
          : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
      }`}
    >
      {children}
    </Link>
  );
}

export default function Navbar() {
  const { user, loading, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="text-lg font-bold text-brand-primary"
        >
          Sanjeevani
        </Link>

        {/* Avoid flashing logged-out nav while the session check resolves. */}
        {loading ? (
          <div className="h-5 w-24 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        ) : user ? (
          <div className="flex items-center gap-6">
            <NavLink href="/dashboard">Dashboard</NavLink>
            <NavLink href="/requests">Requests</NavLink>
            <NavLink href="/donors">Donors</NavLink>
            <span className="hidden text-sm text-zinc-500 dark:text-zinc-400 sm:inline">
              {user.name}
            </span>
            <button
              onClick={logout}
              className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <NavLink href="/login">Login</NavLink>
            <Link
              href="/register"
              className="rounded-lg bg-brand-primary px-3 py-1.5 text-sm font-semibold text-white hover:opacity-90"
            >
              Register
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
