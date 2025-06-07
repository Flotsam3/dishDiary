import * as React from "react";

export function Card({ className = "", children, ...props }) {
  return (
    <div
      className={
        "rounded-xl border bg-white text-slate-900 shadow-sm " + className
      }
      {...props}
    >
      {children}
    </div>
  );
}
