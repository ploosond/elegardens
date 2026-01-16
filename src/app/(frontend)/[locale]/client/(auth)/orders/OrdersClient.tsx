"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { Order } from "@/payload-types";
import { Calendar, Package, Truck, ChevronDown, ChevronUp, FileText } from "lucide-react";

interface OrdersClientProps {
  orders: Order[];
  locale: string;
}

export default function OrdersClient({ orders, locale }: OrdersClientProps) {
  const t = useTranslations("ClientOrders");
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "confirmed":
        return "bg-purple-100 text-purple-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString(
        locale === "de" ? "de-DE" : "en-US",
        {
          year: "numeric",
          month: "short",
          day: "numeric",
        },
      );
    } catch {
      return dateString;
    }
  };

  return (
    <div>
      {orders.length === 0 ? (
        <div className="rounded-lg border border-muted bg-bg p-12 text-center">
          <Package className="mx-auto mb-4 h-12 w-12 text-text/40" />
          <h3 className="mb-2 text-xl font-medium">{t("no_orders_title")}</h3>
          <p className="text-text/70">{t("no_orders_desc")}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const totalItems =
              order.items?.reduce(
                (sum: number, item) => sum + (item.quantity || 0),
                0,
              ) || 0;

            const isExpanded = expandedOrderId === order.id;

            return (
              <div
                key={order.id}
                className="rounded-lg border border-muted bg-bg shadow transition hover:shadow-md"
              >
                <button
                  type="button"
                  onClick={() =>
                    setExpandedOrderId(isExpanded ? null : order.id)
                  }
                  className="w-full p-6 text-left"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-text">
                          {order.orderNumber}
                        </h3>
                        <span
                          className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
                            order.status,
                          )}`}
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </span>
                      </div>
                      <div className="grid gap-2 text-sm text-text/70 md:grid-cols-2">
                        {order.orderDate && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {t("order_date")}: {order.orderDate}
                            </span>
                          </div>
                        )}
                        {order.deliveryDate && (
                          <div className="flex items-center gap-2">
                            <Truck className="h-4 w-4" />
                            <span>
                              {t("delivery_date")}: {order.deliveryDate}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4" />
                          <span>
                            {t("total_items")}: {totalItems}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>
                            {t("created_at")}: {formatDate(order.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-primary">
                      {isExpanded ? (
                        <>
                          <span className="text-sm font-medium">
                            {t("hide_details")}
                          </span>
                          <ChevronUp className="h-5 w-5" />
                        </>
                      ) : (
                        <>
                          <span className="text-sm font-medium">
                            {t("view_details")}
                          </span>
                          <ChevronDown className="h-5 w-5" />
                        </>
                      )}
                    </div>
                  </div>
                </button>

                {/* Expanded Order Details */}
                {isExpanded && (
                  <div className="border-t border-muted bg-muted/30 p-6">
                    <div className="space-y-6">
                      {/* Order Items */}
                      <div>
                        <h4 className="mb-3 text-base font-semibold text-text">
                          {t("order_items")}
                        </h4>
                        <div className="space-y-2">
                          {order.items && order.items.length > 0 ? (
                            order.items.map((item, index) => (
                              <div
                                key={item.id || index}
                                className="flex items-center justify-between rounded-md border border-muted bg-bg p-3"
                              >
                                <div className="flex-1">
                                  <p className="font-medium text-text">
                                    {item.itemName}
                                  </p>
                                  <p className="text-sm text-text/70">
                                    {t("item_id")}: {item.itemId}
                                  </p>
                                </div>
                                <div className="ml-4 text-right">
                                  <p className="font-semibold text-text">
                                    {t("quantity")}: {item.quantity}
                                  </p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-text/70">
                              {t("no_items")}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Notes */}
                      {order.notes && (
                        <div>
                          <div className="mb-2 flex items-center gap-2">
                            <FileText className="h-4 w-4 text-text/70" />
                            <h4 className="text-base font-semibold text-text">
                              {t("notes")}
                            </h4>
                          </div>
                          <p className="rounded-md border border-muted bg-bg p-3 text-sm text-text/80">
                            {order.notes}
                          </p>
                        </div>
                      )}

                      {/* Additional Info */}
                      <div className="grid gap-4 border-t border-muted pt-4 text-sm md:grid-cols-2">
                        <div>
                          <span className="font-medium text-text/70">
                            {t("company_name")}:
                          </span>{" "}
                          <span className="text-text">{order.companyName}</span>
                        </div>
                        <div>
                          <span className="font-medium text-text/70">
                            {t("order_status")}:
                          </span>{" "}
                          <span
                            className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(
                              order.status,
                            )}`}
                          >
                            {order.status.charAt(0).toUpperCase() +
                              order.status.slice(1)}
                          </span>
                        </div>
                        {order.updatedAt && (
                          <div>
                            <span className="font-medium text-text/70">
                              {t("last_updated")}:
                            </span>{" "}
                            <span className="text-text">
                              {formatDate(order.updatedAt)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
