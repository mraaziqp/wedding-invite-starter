import * as React from "react";

export function Button({ className, children, ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-lg bg-pink-500 px-4 py-2 font-medium text-white shadow-md transition hover:bg-pink-600 focus:outline-none ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
