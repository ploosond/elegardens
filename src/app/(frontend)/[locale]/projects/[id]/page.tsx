import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import BackButton from "@/components/ui/BackButton";

const PAYLOAD_API = process.env.NEXT_PUBLIC_PAYLOAD_URL;

async function getProject(slug: string, locale: string) {
  try {
    const url = new URL(`${PAYLOAD_API}/api/projects`);
    url.searchParams.set("where[slug][equals]", slug);
    url.searchParams.set("locale", locale);
    url.searchParams.set("depth", "2");

    const res = await fetch(url.toString(), {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.docs?.[0] || null;
  } catch (error) {
    console.error("Error fetching project:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const project = await getProject(id, locale);
  if (!project) return {};

  const metaTitle =
    locale === "de"
      ? project.metaTitle_de || project.title_de || project.title_en
      : project.metaTitle_en || project.title_en || project.title_de;

  const metaDescription =
    locale === "de"
      ? project.metaDescription_de || project.tagline_de || project.tagline_en
      : project.metaDescription_en || project.tagline_en || project.tagline_de;

  return {
    title: metaTitle || "Project",
    description: metaDescription || "",
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id: slug } = await params;
  const t = await getTranslations("ProjectPage");
  const project = await getProject(slug, locale);

  if (!project) {
    notFound();
  }

  // Helper to get localized field
  const getLocalized = (obj: any, base: string) =>
    obj?.[`${base}_${locale}`] || obj?.[`${base}_en`] || "";

  const sections = Array.isArray(project.sections) ? project.sections : [];

  return (
    <article
      aria-labelledby="project-title"
      className="mx-auto px-4 pt-8 sm:px-6 sm:pt-12 lg:px-8"
    >
      {/* Back Button */}
      <BackButton
        href={`/${locale}/projects`}
        label={t("back_to_projects")}
        className="mb-6"
      />

      {/* Title above image for visibility */}
      <header className="mb-6">
        <h1
          id="project-title"
          className="text-3xl text-center font-bold leading-tight tracking-tight text-primary sm:text-4xl lg:text-5xl"
        >
          {getLocalized(project, "title")}
        </h1>
        {getLocalized(project, "tagline") && (
          <p className="mt-2 text-center text-lg text-gray-600">
            {getLocalized(project, "tagline")}
          </p>
        )}
      </header>

      {/* Larger hero image */}
      {project.image?.url && (
        <div className="mx-auto mb-10 flex max-w-4xl justify-center">
          <div className="relative w-full overflow-hidden rounded border border-gray-200 bg-white shadow-lg">
            <div className="relative h-72 w-full sm:h-80 lg:h-96">
              <Image
                src={project.image.url}
                alt={getLocalized(project, "title")}
                fill
                sizes="(min-width: 1024px) 768px, (min-width: 640px) 640px, 100vw"
                className="object-cover object-center"
                priority
              />
            </div>
          </div>
        </div>
      )}

      {/* Grid: main/aside */}
      <div className="grid grid-cols-1 grid-rows-[auto_1fr] gap-6 lg:grid-cols-3 lg:gap-8">
        {/* Main content (starts at col 1, row 2) */}
        <main className="prose prose-base dark:prose-invert max-w-none lg:col-span-2">
          {sections.length === 0 && (
            <div className="text-gray-500">{t("no_sections")}</div>
          )}
          {sections.map((section: any, index: number) => {
            if (section.blockType === "text-block") {
              return (
                <section
                  key={`section-text-${index}`}
                  className={index < sections.length - 1 ? "mb-8" : ""}
                >
                  {getLocalized(section, "subtitle") && (
                    <h2 className="mb-4 text-lg font-bold text-secondary sm:mb-6 sm:text-xl">
                      {getLocalized(section, "subtitle")}
                    </h2>
                  )}
                  <div className="space-y-2">
                    {Array.isArray(section.paragraphs) &&
                      section.paragraphs.map((para: any, textIndex: number) => (
                        <p
                          key={`text-${index}-${textIndex}`}
                          className="mb-2 text-justify text-sm text-gray-700 sm:mb-4 sm:text-base"
                        >
                          {getLocalized(para, "text")}
                        </p>
                      ))}
                  </div>
                </section>
              );
            }
            if (section.blockType === "image-block") {
              return (
                <section
                  key={`section-image-${index}`}
                  className={index < sections.length - 1 ? "mb-8" : ""}
                >
                  {section.image?.url && (
                    <div className="mb-4 flex justify-center">
                      <div className="relative w-full max-w-xl h-64">
                        <Image
                          src={section.image.url}
                          alt={
                            getLocalized(section, "caption") ||
                            getLocalized(project, "title")
                          }
                          fill
                          sizes="(min-width: 1024px) 768px, (min-width: 640px) 640px, 100vw"
                          className="object-cover object-center rounded shadow"
                        />
                      </div>
                    </div>
                  )}
                  {getLocalized(section, "caption") && (
                    <p className="text-center text-gray-500 italic">
                      {getLocalized(section, "caption")}
                    </p>
                  )}
                </section>
              );
            }
            return null;
          })}
        </main>

        {/* Aside / meta (starts at col 3, row 2) */}
        <aside className="lg:sticky lg:top-20">
          <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-4">
              <span className="inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-primary">
                {getLocalized(project, "category")}
              </span>
            </div>
            <dl className="space-y-3 text-sm text-gray-600">
              {project.client && (
                <div>
                  <dt className="font-medium text-text">{t("client")}</dt>
                  <dd>{project.client}</dd>
                </div>
              )}
            </dl>
          </div>
        </aside>
      </div>
    </article>
  );
}
