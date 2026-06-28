"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function HomePage() {
  const { user, loading } = useAuth();

  return (
    <main className="flex flex-1 items-center justify-center px-4">
      <div className="w-full max-w-xl rounded-2xl border border-zinc-200 bg-white p-10 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="text-4xl font-bold text-brand-primary">Sanjeevani</h1>

        <p className="mt-3 text-zinc-600 dark:text-zinc-400">
          Blood Donor Management System
        </p>

        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-500">
          Connecting patients in need with nearby donors, quickly and
          reliably.
        </p>

        <div className="mt-8 flex flex-col gap-4">
          {loading ? (
           <div className="space-y-3">
           <div className="h-12 rounded-lg animate-pulse bg-zinc-200 dark:bg-zinc-800" />
           <div className="h-12 rounded-lg animate-pulse bg-zinc-200 dark:bg-zinc-800" />
           </div>
          ) : user ? (
            <Link
              href="/dashboard"
              className="rounded-lg bg-brand-primary px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/register"
                className="rounded-lg bg-brand-primary px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90"
              >
                Register as Donor
              </Link>

              <Link
                href="/login"
                className="rounded-lg border border-brand-primary px-5 py-3 font-semibold text-brand-primary transition-colors hover:bg-brand-primary/5"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </main>
  );
}