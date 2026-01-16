import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { getAuthenticatedClient } from "@/lib/auth-client";
import OrdersClient from "./OrdersClient";
import type { Order } from "@/payload-types";
import { getPayload } from "payload";
import configPromise from "@payload-config";

async function getClientOrders(clientId: number): Promise<Order[]> {
  try {
    // Use Payload directly in server component
    const payload = await getPayload({
      config: configPromise,
    });

    const orders = await payload.find({
      collection: "orders",
      where: {
        client: {
          equals: clientId,
        },
      },
      sort: "-createdAt",
      limit: 100,
      depth: 2,
    });

    return orders.docs || [];
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ClientOrders" });

  return {
    title: t("title"),
  };
}

export default async function ClientOrdersPage({
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
  const orders = await getClientOrders(client.id);

  return <OrdersClient orders={orders} locale={locale} />;
}
