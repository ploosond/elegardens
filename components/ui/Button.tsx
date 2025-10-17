import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
  icon?: React.ReactNode;
}

export default function Button({
  children,
  loading = false,
  variant = 'primary',
  icon,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses =
    'inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold shadow transition-colors duration-150 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary-dark',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className='flex items-center'>
          <Loader2 className='animate-spin -ml-1 mr-3 h-5 w-5' />
          {children}
        </span>
      ) : (
        <span className='flex items-center'>
          {icon && <span className='mr-2'>{icon}</span>}
          {children}
        </span>
      )}
    </button>
  );
}
