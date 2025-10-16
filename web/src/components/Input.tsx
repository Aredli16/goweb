import type { ChangeEventHandler, ReactNode } from "react";
import clsx from "clsx";

export default function Input({
  name,
  children,
  error,
  onChange,
}: {
  name: string;
  children: ReactNode;
  error?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}) {
  return (
    <div className="relative">
      <label
        htmlFor={name}
        className={clsx(
          error ? "text-red-500" : "text-gray-900",
          "absolute -top-2 left-4 inline-block rounded-lg bg-white px-2 text-xs font-medium",
        )}
      >
        {children}
      </label>
      <input
        id={name}
        name={name}
        type="text"
        className={clsx(
          error
            ? "outline-2 outline-red-300 focus:outline-red-600"
            : "outline-1 outline-gray-300 focus:outline-gray-600",
          "block w-full rounded-xl bg-white px-3 py-3 text-base text-gray-900 -outline-offset-1 focus:outline-2 focus:-outline-offset-2 sm:text-sm/6",
        )}
        onChange={onChange}
      />

      {error && (
        <p className="mt-1 text-xs font-semibold text-red-400">{error}</p>
      )}
    </div>
  );
}
