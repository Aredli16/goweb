import type { MouseEventHandler, ReactNode } from "react";

export default function Button({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <button
      className="mt-5 bg-primary text-white py-3 px-7 rounded-full font-semibold cursor-pointer"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
