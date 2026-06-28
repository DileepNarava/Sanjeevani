"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { createRequest } from "@/lib/requests";
import Alert from "@/components/Alert";
import type { BloodGroup, CreateRequestPayload } from "@/types/auth";

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

const initialForm: CreateRequestPayload = {
  patientName: "",
  bloodGroup: "O_POS",
  hospital: "",
  city: "",
  unitsRequired: 1,
};

const REDIRECT_DELAY_MS = 900;

function NewRequestForm() {
  const router = useRouter();
  const [form, setForm] = useState<CreateRequestPayload>(initialForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "unitsRequired" ? Number(value) : value,
    }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await createRequest(form);
      setSuccess("Request created successfully. Redirecting…");
      setTimeout(() => {
        router.push("/requests");
      }, REDIRECT_DELAY_MS);
    } catch (err) {
      const message =
        err instanceof Error && "response" in err
          ? // @ts-expect-error - axios error shape
            err.response?.data?.message
          : null;
      setError(message || "Failed to create request. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-16">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Create blood request
      </h1>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        Fill in the patient and hospital details.
      </p>

      {error && <Alert type="error" message={error} />}
      {success && <Alert type="success" message={success} />}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Patient name
          </label>
          <input
            name="patientName"
            value={form.patientName}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-brand-primary dark:border-zinc-700"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Blood group
            </label>
            <select
              name="bloodGroup"
              value={form.bloodGroup}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-brand-primary dark:border-zinc-700"
            >
              {BLOOD_GROUPS.map((bg) => (
                <option key={bg.value} value={bg.value}>
                  {bg.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Units required
            </label>
            <input
              name="unitsRequired"
              type="number"
              min={1}
              value={form.unitsRequired}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-brand-primary dark:border-zinc-700"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Hospital
          </label>
          <input
            name="hospital"
            value={form.hospital}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-brand-primary dark:border-zinc-700"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            City
          </label>
          <input
            name="city"
            value={form.city}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-brand-primary dark:border-zinc-700"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Creating…" : "Create request"}
        </button>
      </form>
    </div>
  );
}

export default function NewRequestPage() {
  return (
    <ProtectedRoute>
      <NewRequestForm />
    </ProtectedRoute>
  );
}
