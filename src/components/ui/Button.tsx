import React from "react";
import clsx from "clsx";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  loading?: boolean;
};

export function Button({ className, variant = "primary", loading, disabled, ...props }: Props) {
  const styles =
    variant === "primary"
      ? "bg-rose-500 text-white hover:bg-rose-600"
      : variant === "secondary"
      ? "bg-neutral-900 text-white hover:bg-neutral-800"
      : variant === "danger"
      ? "bg-red-600 text-white hover:bg-red-700"
      : "bg-transparent hover:bg-neutral-100";

  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition",
        "disabled:opacity-60 disabled:cursor-not-allowed",
        styles,
        className
      )}
    >
      {loading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/70 border-t-transparent" /> : null}
      {props.children}
    </button>
  );
}
