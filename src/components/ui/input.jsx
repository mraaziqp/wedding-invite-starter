import * as React from "react";

export function Input({ className, ...props }) {
  return (
    <input
      className={`w-full rounded-lg border px-3 py-2 shadow-sm focus:border-pink-500 focus:ring focus:ring-pink-200 ${className}`}
      {...props}
    />
  );
}
