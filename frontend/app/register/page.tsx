"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/auth";
import Alert from "@/components/Alert";
import type { BloodGroup, RegisterPayload } from "@/types/auth";

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

const initialForm: RegisterPayload = {
  name: "",
  email: "",
  password: "",
  phone: "",
  bloodGroup: "O_POS",
  city: "",
};

const REDIRECT_DELAY_MS = 900;

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState<RegisterPayload>(initialForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await registerUser(form);
      setSuccess("Account created successfully. Redirecting to login…");
      setTimeout(() => {
        router.push("/login");
      }, REDIRECT_DELAY_MS);
    } catch (err) {
      const message =
        err instanceof Error && "response" in err
          ? // @ts-expect-error - axios error shape
            err.response?.data?.message
          : null;
      setError(message || "Registration failed. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Create your account
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Join Sanjeevani as a donor or requester.
        </p>

        {error && <Alert type="error" message={error} />}
        {success && <Alert type="success" message={success} />}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Full name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-brand-primary dark:border-zinc-700"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-brand-primary dark:border-zinc-700"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Password
            </label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-brand-primary dark:border-zinc-700"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Phone
            </label>
            <input
              name="phone"
              value={form.phone}
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
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
          Already have an account?{" "}
          <a href="/login" className="font-medium text-brand-primary">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
