"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import HeroSection from "@/components/ui/HeroSection";
import NewsletterSignupClient from "@/components/ui/NewsletterSignupClient";
import { useEffect, useState } from "react";
import type { About } from "@/payload-types";

export default function AboutPage() {
  const t = useTranslations("AboutPage");
  const [about, setAbout] = useState<About | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const locale = useLocale();

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(
      `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/globals/about?locale=${locale}`,
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => setAbout(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [locale]);

  // Helper for localized fields
  const get = (base: string) =>
    about?.[`${base}_${locale}`] || about?.[`${base}_en`] || "";

  if (loading)
    return <div className="text-center py-20 text-xl">Loading...</div>;
  if (error)
    return (
      <div className="text-center py-20 text-xl text-red-500">{error}</div>
    );

  return (
    <div>
      {/* Hero Section */}
      <HeroSection
        title={t("hero_title")}
        highlight={t("hero_highlight")}
        description={t("hero_description")}
      />

      {/* Our Roots & Philosophy */}
      <section className="py-8 sm:py-10 md:py-12">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          <h2 className="mb-4 text-3xl font-bold text-primary md:text-4xl">
            {get("roots_title")}
          </h2>
          <p className="mb-8 text-base text-text sm:text-lg md:text-xl">
            {get("roots_intro")}
          </p>
          <p className="text-end text-xs italic text-text opacity-70 sm:text-sm">
            {get("roots_signature")}
          </p>
        </div>
      </section>

      {/* Milestones */}
      <section className="bg-white px-2 sm:px-4 md:px-10 lg:px-40">
        <div className="mx-auto max-w-6xl px-0 sm:px-4">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold text-primary sm:text-4xl md:text-5xl">
              {get("milestones_title")}
            </h2>
          </div>

          {Array.isArray(about?.milestones) &&
            about.milestones.map((ms, i: number) => {
              // Type guard for Media - check if it's an object with url property
              const imageUrl =
                ms.image && typeof ms.image === "object" && "url" in ms.image
                  ? ms.image.url
                  : null;

              return (
                <div
                  key={`milestone-${i}-${ms.title_en || i}`}
                  className="mt-8 grid grid-cols-1 md:min-h-[20rem] md:grid-cols-2 md:items-center md:gap-12"
                >
                  {imageUrl && (
                    <div
                      className={`relative h-64 w-full overflow-hidden rounded-md md:h-full ${
                        i % 2 === 1 ? "md:order-2" : "md:order-1"
                      }`}
                    >
                      <Image
                        src={imageUrl}
                        alt={ms[`title_${locale}`] || ms.title_en || ""}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div
                    className={`flex flex-col justify-center px-4 py-4 sm:px-8 sm:py-6 md:px-0 ${
                      i % 2 === 1 ? "md:order-1" : "md:order-2"
                    }`}
                  >
                    <h3 className="mb-4 text-xl font-extrabold text-secondary sm:mb-6 sm:text-2xl">
                      {ms[`title_${locale}`] || ms.title_en}
                    </h3>
                    {ms[`subtitle1_${locale}`] && (
                      <p className="mb-2 text-justify text-sm text-text sm:mb-4 sm:text-base">
                        <span className="font-bold text-text">
                          {ms[`subtitle1_${locale}`] || ms.subtitle1_en}
                        </span>{" "}
                        {ms[`desc1_${locale}`] || ms.desc1_en}
                      </p>
                    )}
                    {ms[`subtitle2_${locale}`] && (
                      <p className="text-justify text-sm text-text sm:text-base">
                        <span className="font-bold text-text">
                          {ms[`subtitle2_${locale}`] || ms.subtitle2_en}
                        </span>{" "}
                        {ms[`desc2_${locale}`] || ms.desc2_en}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </section>

      {/* CEO + Mission/Values */}
      <section className="py-10 sm:py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
            {/* Story / Mission / Vision / Values */}
            <div className="order-2 flex items-center px-2 sm:px-4 md:order-1 md:min-h-[20rem] md:px-0 lg:min-h-[24rem]">
              <div className="w-full px-4 py-4 sm:px-8 sm:py-6 md:px-0">
                <h2 className="mb-4 text-3xl font-extrabold text-secondary">
                  {get("mission_title")}
                </h2>
                <p className="mb-4 text-justify text-base text-text">
                  <span className="font-bold text-text">
                    {get("mission_title")}
                  </span>{" "}
                  {get("mission_desc")}
                </p>
                <p className="mb-4 text-justify text-base text-text">
                  <span className="font-bold text-text">
                    {get("vision_title")}
                  </span>{" "}
                  {get("vision_desc")}
                </p>
                <p className="text-justify text-base text-text">
                  <span className="font-bold">{get("values_title")}</span>{" "}
                  {get("values_desc")}
                </p>
              </div>
            </div>
            {/* CEO Image */}
            <div className="relative order-1 min-h-[20rem] overflow-hidden rounded-md md:order-2 lg:min-h-[24rem]">
              {about?.ceo_image &&
                typeof about.ceo_image === "object" &&
                "url" in about.ceo_image &&
                about.ceo_image.url && (
                  <Image
                    src={about.ceo_image.url}
                    alt={get("ceo_title")}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                    priority={false}
                  />
                )}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 to-black/10" />
              <div className="absolute bottom-6 left-6 w-[calc(100%-3rem)] text-on-dark md:w-auto">
                <h3 className="text-lg font-bold">{get("ceo_title")}</h3>
                <p className="mt-1 text-sm">{get("ceo_desc")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter could be added later once component is ready */}
      <section className="py-2 sm:py-4">
        <div className="mx-auto max-w-6xl px-2 sm:px-4">
          <NewsletterSignupClient />
        </div>
      </section>
    </div>
  );
}
