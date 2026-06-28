"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { getMyRequests } from "@/lib/requests";
import type { BloodRequest } from "@/types/auth";

const BLOOD_GROUP_LABELS: Record<string, string> = {
  O_POS: "O+",
  O_NEG: "O-",
  A_POS: "A+",
  A_NEG: "A-",
  B_POS: "B+",
  B_NEG: "B-",
  AB_POS: "AB+",
  AB_NEG: "AB-",
};

const PREVIEW_COUNT = 3;

function DashboardContent() {
  const { user } = useAuth();
  const [myRequests, setMyRequests] = useState<BloodRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [error, setError] = useState("");

  const fetchMyRequests = useCallback(async () => {
    setLoadingRequests(true);
    setError("");
    try {
      const res = await getMyRequests();
      setMyRequests(res.requests);
    } catch {
      setError("Failed to load your requests.");
    } finally {
      setLoadingRequests(false);
    }
  }, []);

  useEffect(() => {
    async function loadMyRequests() {
      await fetchMyRequests();
    }

    loadMyRequests();
  }, [fetchMyRequests]);

  if (!user) return null;

  const preview = myRequests.slice(0, PREVIEW_COUNT);

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-16">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Welcome, {user.name}
      </h1>

      {/* Primary actions */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          href="/requests/new"
          className="rounded-2xl border border-brand-primary/30 bg-brand-primary/5 p-6 transition-colors hover:bg-brand-primary/10"
        >
          <p className="text-lg font-semibold text-brand-primary">
            Need blood?
          </p>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Create a blood request
          </p>
        </Link>

        <Link
          href="/requests"
          className="rounded-2xl border border-zinc-200 bg-white p-6 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800"
        >
          <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Want to donate?
          </p>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Browse blood requests
          </p>
        </Link>
      </div>

      {/* My Requests preview */}
      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            My requests
          </h2>
          <Link
            href="/requests"
            className="text-sm font-medium text-brand-primary hover:opacity-80"
          >
            View all →
          </Link>
        </div>

        <div className="mt-3 space-y-2">
          {loadingRequests ? (
            <p className="text-sm text-zinc-500">Loading…</p>
          ) : error ? (
            <p className="text-sm text-brand-primary">{error}</p>
          ) : preview.length === 0 ? (
            <p className="text-sm text-zinc-500">
              You haven&apos;t created any requests yet.
            </p>
          ) : (
            preview.map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    {request.patientName}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {request.hospital}, {request.city}
                  </p>
                </div>
                <span className="rounded-full bg-brand-primary/10 px-2.5 py-1 text-xs font-semibold text-brand-primary">
                  {BLOOD_GROUP_LABELS[request.bloodGroup] ?? request.bloodGroup}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Profile — secondary */}
      <div className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Profile information
        </h2>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoRow label="Name" value={user.name} />
          <InfoRow
            label="Blood group"
            value={BLOOD_GROUP_LABELS[user.bloodGroup] ?? user.bloodGroup}
          />
          <InfoRow label="Phone" value={user.phone} />
          <InfoRow label="City" value={user.city} />
          <InfoRow label="Email" value={user.email} />
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
      <p className="text-xs text-zinc-500 dark:text-zinc-400">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-zinc-900 dark:text-zinc-50">
        {value}
      </p>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}