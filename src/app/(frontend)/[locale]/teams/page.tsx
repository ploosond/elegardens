import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import HeroSection from "@/components/ui/HeroSection";
import TeamsClient from "./TeamsClient";
import type { Employee } from "@/payload-types";

const PAYLOAD_API = process.env.NEXT_PUBLIC_PAYLOAD_URL;

async function getEmployees(locale: string): Promise<Employee[]> {
  try {
    const url = new URL(`${PAYLOAD_API}/api/employees`);
    url.searchParams.set("locale", locale);
    url.searchParams.set("limit", "1000");
    url.searchParams.set("sort", "createdAt");

    const res = await fetch(url.toString(), {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return [];
    const data = await res.json();
    return data.docs || [];
  } catch (error) {
    console.error("Error fetching employees:", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "TeamsPage" });

  return {
    title: `${t("hero_title")} - ${t("hero_highlight")}`,
    description: t("hero_description"),
  };
}

export default async function TeamsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("TeamsPage");
  const employees = await getEmployees(locale);

  return (
    <div>
      <HeroSection
        title={t("hero_title")}
        highlight={t("hero_highlight")}
        description={t("hero_description")}
      />
      <TeamsClient initialEmployees={employees} />
    </div>
  );
}
