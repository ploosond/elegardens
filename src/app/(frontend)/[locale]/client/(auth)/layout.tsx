import { redirect } from "@/i18n/navigation";
import { getAuthenticatedClient } from "@/lib/auth-client";
import ClientLayoutClient from "./ClientLayoutClient";

export default async function AuthClientLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Check authentication - redirect to login if not authenticated
  const client = await getAuthenticatedClient();
  if (!client) {
    redirect({ href: "/client/login", locale });
  }

  return <ClientLayoutClient locale={locale}>{children}</ClientLayoutClient>;
}
