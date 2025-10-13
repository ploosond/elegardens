import { AlertCircle } from 'lucide-react';
import { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  error?: string;
  label?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ icon, error, label, className = '', ...props }, ref) => {
    return (
      <div>
        {label && (
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            {label}
          </label>
        )}
        <div className='relative'>
          {icon && (
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`w-full ${
              icon ? 'pl-10' : 'pl-4'
            } pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              error ? 'border-red-500' : ''
            } ${className}`}
            {...props}
          />
        </div>
        {error && (
          <p className='mt-2 text-sm text-red-600 flex items-center'>
            <AlertCircle className='w-4 h-4 mr-1' />
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
