"use client";

import { useTranslations } from "next-intl";
import type { Client } from "@/payload-types";
import { Building2, Mail, Phone, MapPin } from "lucide-react";

interface DashboardClientProps {
  client: Client;
  locale: string;
}

export default function DashboardClient({
  client,
  locale,
}: DashboardClientProps) {
  const t = useTranslations("ClientDashboard");

  return (
    <div>
      {/* Client Info Card */}
      <div className="rounded-lg border border-muted bg-bg p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold text-text">
          {t("account_info")}
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-start gap-3">
            <Building2 className="mt-1 h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-medium text-text/70">Company Name</p>
              <p className="text-text">{client.companyName}</p>
            </div>
          </div>
          {client.contactPerson && (
            <div className="flex items-start gap-3">
              <Mail className="mt-1 h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-text/70">
                  Contact Person
                </p>
                <p className="text-text">{client.contactPerson}</p>
              </div>
            </div>
          )}
          <div className="flex items-start gap-3">
            <Mail className="mt-1 h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-medium text-text/70">Email</p>
              <p className="text-text">{client.email}</p>
            </div>
          </div>
          {client.phone && (
            <div className="flex items-start gap-3">
              <Phone className="mt-1 h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-text/70">Phone</p>
                <p className="text-text">{client.phone}</p>
              </div>
            </div>
          )}
          <div className="flex items-start gap-3 md:col-span-2">
            <MapPin className="mt-1 h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-medium text-text/70">Address</p>
              <p className="text-text whitespace-pre-line">{client.address}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div>
              <p className="text-sm font-medium text-text/70">Client ID</p>
              <p className="text-text font-mono">{client.clientId}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
