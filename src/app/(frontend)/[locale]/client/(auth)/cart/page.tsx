import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { getAuthenticatedClient } from "@/lib/auth-client";
import CartClient from "./CartClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ClientCart" });

  return {
    title: t("title"),
  };
}

export default async function ClientCartPage({
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

  // Client is guaranteed to be non-null here due to the check above
  return <CartClient client={client!} locale={locale} />;
}
