"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { getAllRequests, getMyRequests, deleteRequest } from "@/lib/requests";
import Alert from "@/components/Alert";
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

type Tab = "all" | "mine";

const SUCCESS_CLEAR_MS = 2500;

function RequestsList() {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>("all");
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchRequests = useCallback(async (activeTab: Tab) => {
    setLoading(true);
    setError("");
    try {
      const res =
        activeTab === "all" ? await getAllRequests() : await getMyRequests();
      setRequests(res.requests);
    } catch {
      setError("Failed to load requests.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    async function loadRequests() {
      await fetchRequests(tab);
    }

    loadRequests();
  }, [tab, fetchRequests]);

  async function handleDelete(id: string) {
    setDeletingId(id);
    setError("");
    try {
      await deleteRequest(id);
      setRequests((prev) => prev.filter((r) => r.id !== id));
      setSuccess("Request deleted.");
      setTimeout(() => setSuccess(""), SUCCESS_CLEAR_MS);
    } catch {
      setError("Failed to delete request.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-16">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Blood requests
        </h1>
        <Link
          href="/requests/new"
          className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          New request
        </Link>
      </div>

      <div className="mt-6 flex gap-2 border-b border-zinc-200 dark:border-zinc-800">
        <TabButton active={tab === "all"} onClick={() => setTab("all")}>
          All requests
        </TabButton>
        <TabButton active={tab === "mine"} onClick={() => setTab("mine")}>
          My requests
        </TabButton>
      </div>

      {error && <Alert type="error" message={error} />}
      {success && <Alert type="success" message={success} />}

      <div className="mt-6 space-y-3">
        {loading ? (
          <p className="text-sm text-zinc-500">Loading requests…</p>
        ) : requests.length === 0 ? (
          <p className="text-sm text-zinc-500">
            {tab === "all" ? "No requests yet." : "You haven't created any requests yet."}
          </p>
        ) : (
          requests.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              isOwner={request.userId === user?.id}
              deleting={deletingId === request.id}
              onDelete={() => handleDelete(request.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`-mb-px border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
        active
          ? "border-brand-primary text-brand-primary"
          : "border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
      }`}
    >
      {children}
    </button>
  );
}

function RequestCard({
  request,
  isOwner,
  deleting,
  onDelete,
}: {
  request: BloodRequest;
  isOwner: boolean;
  deleting: boolean;
  onDelete: () => void;
}) {
  // Actions are collected into a list rather than hardcoded as a single
  // "Delete" button, so future actions (Edit, Mark Fulfilled, Contact
  // Donor) can be added here without changing the card's structure.
  const actions: {
    key: string;
    label: string;
    onClick: () => void;
    disabled?: boolean;
    variant?: "default" | "danger";
  }[] = [];

  if (isOwner) {
    actions.push({
      key: "delete",
      label: deleting ? "Deleting…" : "Delete",
      onClick: onDelete,
      disabled: deleting,
      variant: "danger",
    });
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-medium text-zinc-900 dark:text-zinc-50">
            {request.patientName}
          </p>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {request.hospital}, {request.city}
          </p>
        </div>
        <span className="rounded-full bg-brand-primary/10 px-2.5 py-1 text-xs font-semibold text-brand-primary">
          {BLOOD_GROUP_LABELS[request.bloodGroup] ?? request.bloodGroup}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-400">
        <span>{request.unitsRequired} unit(s) required</span>
        {request.user && <span>Posted by {request.user.name}</span>}
      </div>

      {actions.length > 0 && (
        <div className="mt-3 flex gap-2">
          {actions.map((action) => (
            <button
              key={action.key}
              onClick={action.onClick}
              disabled={action.disabled}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium disabled:opacity-50 ${
                action.variant === "danger"
                  ? "border-zinc-300 text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  : "border-brand-primary text-brand-primary hover:bg-brand-primary/5"
              }`}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function RequestsPage() {
  return (
    <ProtectedRoute>
      <RequestsList />
    </ProtectedRoute>
  );
}
