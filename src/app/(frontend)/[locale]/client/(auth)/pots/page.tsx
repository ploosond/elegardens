import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { getAuthenticatedClient } from "@/lib/auth-client";
import PotsClient from "./PotsClient";
import type { Pot } from "@/payload-types";

const PAYLOAD_API = process.env.NEXT_PUBLIC_PAYLOAD_URL;

async function getPots(): Promise<Pot[]> {
  try {
    if (!PAYLOAD_API) {
      console.error("NEXT_PUBLIC_PAYLOAD_URL is not set");
      return [];
    }

    const url = new URL(`${PAYLOAD_API}/api/pots`);
    url.searchParams.set("limit", "1000");
    url.searchParams.set("sort", "potId");
    url.searchParams.set("depth", "2");

    const res = await fetch(url.toString(), {
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      console.error(`Failed to fetch pots: ${res.status} ${res.statusText}`);
      return [];
    }
    const data = await res.json();
    return data.docs || [];
  } catch (error) {
    console.error("Error fetching pots:", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "PotsPage" });

  return {
    title: `${t("hero_title")} - ${t("hero_highlight")}`,
    description: t("hero_description"),
  };
}

export default async function ClientPotsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Check authentication
  const client = await getAuthenticatedClient();
  if (!client) {
    redirect({ href: "/client/login", locale });
  }

  const pots = await getPots();

  return <PotsClient initialPots={pots} />;
}
