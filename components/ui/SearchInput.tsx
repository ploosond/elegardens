import React from 'react';
import { Search } from 'lucide-react';

interface SearchInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export default function SearchInput({
  value,
  onChange,
  placeholder = 'Search...',
  ...props
}: SearchInputProps) {
  return (
    <div className='relative mx-auto max-w-md'>
      <input
        type='text'
        placeholder={placeholder}
        value={value as string}
        onChange={onChange}
        className='w-full rounded-lg border border-transparent bg-white/10 py-3 pl-10 pr-4 text-on-dark placeholder-on-dark/70  focus:outline-none focus:ring-0 focus:border-transparent focus:shadow-none'
        {...props}
      />
      <Search
        className='absolute left-3 top-1/2 -translate-y-1/2 transform text-on-dark/70'
        size={20}
      />
    </div>
  );
}
