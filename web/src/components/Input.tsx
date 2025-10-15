import type { ReactNode } from "react";

export default function Input({
  name,
  children,
}: {
  name: string;
  children: ReactNode;
}) {
  return (
    <div className="relative">
      <label
        htmlFor={name}
        className="absolute -top-2 left-4 inline-block rounded-lg bg-white px-2 text-xs font-medium text-gray-900"
      >
        {children}
      </label>
      <input
        id={name}
        name={name}
        type="text"
        className="block w-full rounded-xl bg-white px-3 py-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300  focus:outline-2 focus:-outline-offset-2 focus:outline-gray-600 sm:text-sm/6"
      />
    </div>
  );
}
