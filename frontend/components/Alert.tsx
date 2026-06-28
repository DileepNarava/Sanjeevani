type AlertType = "error" | "success";

interface AlertProps {
  type: AlertType;
  message: string;
}

export default function Alert({ type, message }: AlertProps) {
  const styles =
    type === "error"
      ? "bg-red-50 text-brand-primary dark:bg-red-950/40"
      : "bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400";

  return (
    <p className={`mt-4 rounded-lg px-3 py-2 text-sm ${styles}`} role="status">
      {message}
    </p>
  );
}
