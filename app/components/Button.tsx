"use client";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  ariaLabel?: string;
  className?: string;
}

export default function Button({
  children,
  onClick,
  ariaLabel,
  className = "",
}: ButtonProps) {
  return (
    <button
      className={`${className} cursor-pointer px-6 py-3 border border-purple-400 rounded-full bg-purple-900 hover:bg-purple-800 focus:ring-2 focus:ring-purple-500 focus:outline-none text-white w-full  transition-colors duration-200`}
      aria-label={ariaLabel}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
