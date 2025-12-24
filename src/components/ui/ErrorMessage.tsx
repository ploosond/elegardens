import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  type?: 'field' | 'form';
}

export default function ErrorMessage({
  message,
  type = 'field',
}: ErrorMessageProps) {
  if (type === 'form') {
    return (
      <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center'>
        <AlertCircle className='w-5 h-5 mr-2 text-red-500' />
        {message}
      </div>
    );
  }

  return (
    <p className='mt-2 text-sm text-red-600 flex items-center'>
      <AlertCircle className='w-4 h-4 mr-1' />
      {message}
    </p>
  );
}
