import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

interface BackButtonProps {
  href: string;
  label: string;
  className?: string;
  fullWidth?: boolean;
}

export default function BackButton({
  href,
  label,
  className = '',
  fullWidth = false,
}: BackButtonProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-on-dark shadow transition-colors duration-150 hover:bg-primary-dark ${
        fullWidth ? 'w-full justify-center' : ''
      } ${className}`}
    >
      <ChevronLeft className='h-5 w-5' />
      <span>{label}</span>
    </Link>
  );
}
