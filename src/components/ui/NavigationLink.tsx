import Link from 'next/link';
import { ReactNode } from 'react';

interface NavigationLinkProps {
  href: string;
  children: ReactNode;
  isActive?: boolean;
  className?: string;
}

export default function NavigationLink({
  href,
  children,
  isActive = false,
  className = '',
}: NavigationLinkProps) {
  return (
    <Link
      href={href}
      className={`rounded-md px-4 py-3 text-white font-semibold transition-colors ${
        isActive ? 'bg-green-700' : 'bg-green-600 hover:bg-green-700'
      } ${className}`}
    >
      {children}
    </Link>
  );
}
