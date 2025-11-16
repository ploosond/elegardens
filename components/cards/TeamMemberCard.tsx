'use client';

import Image from 'next/image';
import { useLocale } from 'next-intl';
import { EmployeeDto } from '@/types/dto/employee.dto';

interface TeamMemberCardProps {
  member: EmployeeDto;
}

export default function TeamMemberCard({ member }: TeamMemberCardProps) {
  const locale = useLocale();

  return (
    <div className='flex h-[320px] flex-col justify-between overflow-hidden rounded-lg bg-white p-4 text-center shadow-md transition hover:shadow-lg'>
      {member.profilePicture?.url ? (
        <Image
          src={member.profilePicture.url}
          alt={`${member.first_name} ${member.last_name}`}
          width={128}
          height={128}
          className='mx-auto mb-4 h-32 w-32 rounded-full object-cover'
        />
      ) : (
        <div className='mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-full bg-primary'>
          <span className='text-4xl font-bold text-on-dark'>
            {member.first_name[0]}
            {member.last_name[0]}
          </span>
        </div>
      )}
      <h3 className='mb-2 text-xl font-semibold text-primary'>
        {member.first_name} {member.last_name}
      </h3>
      <p className='mb-2 truncate text-sm font-semibold text-secondary line-clamp-2 break-words'>
        {member.role[locale as 'en' | 'de']}
      </p>
      <div className='mt-2 space-y-1'>
        <p className='break-words text-sm text-gray-500'>{member.email}</p>
        <p className='text-xs text-gray-500 md:text-sm'>{member.telephone}</p>
      </div>
    </div>
  );
}
