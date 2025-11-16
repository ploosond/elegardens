interface HeroSectionProps {
  title: string;
  highlight?: string;
  description?: string;
}

export default function HeroSection({
  title,
  highlight,
  description,
}: HeroSectionProps) {
  return (
    <section className='relative bg-gradient-to-r from-primary-dark to-primary py-16 text-on-dark'>
      <div className='container relative mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='mx-auto max-w-2xl space-y-6 text-center'>
          <h2 className='text-4xl font-bold md:text-5xl'>
            {title} <span className='text-accent'>{highlight}</span>
          </h2>
          <p className='text-lg leading-relaxed text-on-light'>{description}</p>
        </div>
      </div>
    </section>
  );
}
