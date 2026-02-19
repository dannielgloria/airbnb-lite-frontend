import React from "react";
import clsx from "clsx";

export function Input({
  label,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string }) {
  const id = props.id ?? props.name;

  return (
    <div className="space-y-1">
      {label ? <label htmlFor={id} className="text-sm font-medium text-neutral-800">{label}</label> : null}
      <input
        {...props}
        id={id}
        className={clsx(
          "w-full rounded-xl border px-3 py-2 text-sm outline-none transition",
          "focus:ring-4 focus:ring-rose-500/15 focus:border-rose-500",
          error ? "border-red-500 focus:ring-red-500/10 focus:border-red-500" : "border-neutral-200"
        )}
      />
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
