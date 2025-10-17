import { ReactNode } from 'react';

interface LogoutButtonProps {
  onClick: () => void;
  children?: ReactNode;
  className?: string;
}

export default function LogoutButton({
  onClick,
  children = 'Logout',
  className = '',
}: LogoutButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`rounded-md cursor-pointer bg-red-500 px-4 py-3 text-white font-semibold hover:bg-red-600 transition-colors ${className}`}
    >
      {children}
    </button>
  );
}
