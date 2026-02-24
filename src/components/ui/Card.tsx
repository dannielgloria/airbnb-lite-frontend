import React from "react";
import clsx from "clsx";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={clsx("rounded-2xl border border-neutral-200 bg-white shadow-sm", className)}
    />
  );
}
