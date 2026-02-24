import React from "react";
import clsx from "clsx";

export function Banner({
  title,
  children,
  variant = "info",
}: {
  title: string;
  children?: React.ReactNode;
  variant?: "info" | "error" | "success";
}) {
  const styles =
    variant === "error"
      ? "border-red-200 bg-red-50 text-red-900"
      : variant === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-900"
      : "border-blue-200 bg-blue-50 text-blue-900";

  return (
    <div className={clsx("rounded-2xl border p-4", styles)}>
      <div className="font-semibold">{title}</div>
      {children ? <div className="mt-1">{children}</div> : null}
    </div>
  );
}
