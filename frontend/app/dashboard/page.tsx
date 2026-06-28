"use client";

import { useEffect, useState, useCallback, type FormEvent } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { searchDonors } from "@/lib/donors";
import Alert from "@/components/Alert";
import type { BloodGroup, Donor } from "@/types/auth";

const BLOOD_GROUPS: { value: BloodGroup; label: string }[] = [
  { value: "O_POS", label: "O+" },
  { value: "O_NEG", label: "O-" },
  { value: "A_POS", label: "A+" },
  { value: "A_NEG", label: "A-" },
  { value: "B_POS", label: "B+" },
  { value: "B_NEG", label: "B-" },
  { value: "AB_POS", label: "AB+" },
  { value: "AB_NEG", label: "AB-" },
];

const BLOOD_GROUP_LABELS: Record<string, string> = Object.fromEntries(
  BLOOD_GROUPS.map((bg) => [bg.value, bg.label])
);

function DonorSearch() {
  const [bloodGroup, setBloodGroup] = useState<BloodGroup | "">("");
  const [city, setCity] = useState("");
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const runSearch = useCallback(
    async (filters: { bloodGroup?: BloodGroup; city?: string }) => {
      setLoading(true);
      setError("");
      try {
        const res = await searchDonors(filters);
        setDonors(res.donors);
      } catch {
        setError("Failed to search donors.");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Show all donors (up to the backend's cap) on first load, before any
  // filter is applied.
  useEffect(() => {
    async function loadInitial() {
      await runSearch({});
    }

    loadInitial();
  }, [runSearch]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await runSearch({
      bloodGroup: bloodGroup || undefined,
      city: city.trim() || undefined,
    });
  }

  function handleClear() {
    setBloodGroup("");
    setCity("");
    runSearch({});
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-16">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Find donors
      </h1>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        Search registered donors by blood group and city.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-[1fr_1fr_auto]"
      >
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Blood group
          </label>
          <select
            value={bloodGroup}
            onChange={(e) => setBloodGroup(e.target.value as BloodGroup | "")}
            className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-brand-primary dark:border-zinc-700"
          >
            <option value="">Any</option>
            {BLOOD_GROUPS.map((bg) => (
              <option key={bg.value} value={bg.value}>
                {bg.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            City
          </label>
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="e.g. Vijayawada"
            className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-brand-primary dark:border-zinc-700"
          />
        </div>

        <div className="flex items-end gap-2">
          <button
            type="submit"
            className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            Search
          </button>
          {(bloodGroup || city) && (
            <button
              type="button"
              onClick={handleClear}
              className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Clear
            </button>
          )}
        </div>
      </form>

      {error && <Alert type="error" message={error} />}

      <div className="mt-6 space-y-2">
        {loading ? (
          <p className="text-sm text-zinc-500">Searching…</p>
        ) : donors.length === 0 ? (
          <p className="text-sm text-zinc-500">
            No donors found matching these filters.
          </p>
        ) : (
          donors.map((donor) => (
            <div
              key={donor.id}
              className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                  {donor.name}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {donor.city}
                </p>
              </div>
              <span className="rounded-full bg-brand-primary/10 px-2.5 py-1 text-xs font-semibold text-brand-primary">
                {BLOOD_GROUP_LABELS[donor.bloodGroup] ?? donor.bloodGroup}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function DonorsPage() {
  return (
    <ProtectedRoute>
      <DonorSearch />
    </ProtectedRoute>
  );
}
