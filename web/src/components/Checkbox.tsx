import type { ReactNode } from "react";

export default function Checkbox({ children }: { children: ReactNode }) {
  return (
    <label className="flex items-center gap-3 text-sm text-gray-700">
      <input
        type="checkbox"
        className="w-5 h-5 mt-0.5 border border-gray-300 rounded-md accent-primary focus:ring-primary focus:ring-2 focus:ring-offset-0"
      />
      {children}
    </label>
  );
}
