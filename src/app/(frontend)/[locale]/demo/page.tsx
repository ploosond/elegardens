import { useTranslations } from 'next-intl'

export default function Demo() {
  const t = useTranslations('Demo')

  return <div>{t('hello')}</div>
}
