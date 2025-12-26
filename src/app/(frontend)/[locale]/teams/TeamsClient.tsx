'use client'

import { useMemo, useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import TeamMemberCard from '@/components/cards/TeamMemberCard'
import { Link } from '@/i18n/navigation'
import type { Employee } from '@/payload-types'

interface TeamsClientProps {
  initialEmployees: Employee[]
}

export default function TeamsClient({ initialEmployees }: TeamsClientProps) {
  const t = useTranslations('TeamsPage')
  const locale = useLocale()
  const [activeDepartment, setActiveDepartment] = useState<string | null>(null)

  // Sort employees so CEO is at the top
  const sortedEmployees = useMemo(() => {
    return [...initialEmployees].sort((a, b) => {
      const roleA = locale === 'de' ? a.role_de : a.role_en
      const roleB = locale === 'de' ? b.role_de : b.role_en
      if (roleA === 'CEO' && roleB !== 'CEO') return -1
      if (roleA !== 'CEO' && roleB === 'CEO') return 1
      return 0
    })
  }, [initialEmployees, locale])

  // Extract unique departments based on current locale
  const departments = useMemo(() => {
    return [
      ...new Set(
        sortedEmployees
          .map((emp: Employee) => (locale === 'de' ? emp.department_de : emp.department_en))
          .filter(Boolean),
      ),
    ]
  }, [sortedEmployees, locale])

  // Filter team members based on selected department
  const filteredEmployees = useMemo(() => {
    return activeDepartment
      ? sortedEmployees.filter(
          (emp: Employee) =>
            (locale === 'de' ? emp.department_de : emp.department_en) === activeDepartment,
        )
      : sortedEmployees
  }, [activeDepartment, sortedEmployees, locale])

  // Split filtered employees into CEO(s) and others
  const ceos = filteredEmployees.filter(
    (emp: Employee) => (locale === 'de' ? emp.role_de : emp.role_en) === 'CEO',
  )
  const others = filteredEmployees.filter(
    (emp: Employee) => (locale === 'de' ? emp.role_de : emp.role_en) !== 'CEO',
  )

  return (
    <>
      {/* Team Members Section */}
      <section className="py-4 sm:py-8">
        <div className="mx-auto px-4 sm:px-6">
          {/* Department Filter */}
          <div className="mb-6 flex flex-wrap justify-center gap-3">
            <button
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
                activeDepartment === null
                  ? 'bg-primary text-on-dark'
                  : 'bg-surface text-primary hover:bg-muted'
              }`}
              onClick={() => setActiveDepartment(null)}
            >
              {t('all_departments')}
            </button>
            {departments.filter(Boolean).map((departmentName) => (
              <button
                key={departmentName}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
                  activeDepartment === departmentName
                    ? 'bg-primary text-on-dark'
                    : 'bg-surface text-primary hover:bg-muted'
                }`}
                onClick={() => setActiveDepartment(departmentName ?? null)}
              >
                {departmentName}
              </button>
            ))}
          </div>

          {/* CEO row */}
          {ceos.length > 0 && (
            <div className="flex flex-wrap justify-center mb-0">
              {ceos.map((employee: Employee) => (
                <div
                  key={employee.id}
                  className="mb-6 w-full px-3 sm:mb-8 sm:w-1/2 sm:px-4 md:w-1/3 lg:w-1/6"
                >
                  <TeamMemberCard member={employee} />
                </div>
              ))}
            </div>
          )}

          {/* Other team members grid */}
          <div className="flex flex-wrap justify-center -mx-3 sm:-mx-4">
            {others.map((employee: Employee) => (
              <div
                key={employee.id}
                className="mb-6 w-full px-3 sm:mb-8 sm:w-1/2 sm:px-4 md:w-1/3 lg:w-1/6"
              >
                <TeamMemberCard member={employee} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-primary/10 py-12 text-center">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-2xl font-semibold text-primary md:text-3xl">
            {t('get_in_touch_title')}
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-text opacity-70">{t('get_in_touch_desc')}</p>
          <div className="mt-6">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 font-semibold text-on-dark transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 cursor-pointer"
            >
              {t('contact_us')}
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

