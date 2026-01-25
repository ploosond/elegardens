"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import type { Client } from "@/payload-types";
import { Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { useCart, type CartItem } from "@/contexts/CartContext";

interface CartClientProps {
  client: Client;
  locale: string;
}

export default function CartClient({ client }: CartClientProps) {
  const t = useTranslations("ClientCart");
  const router = useRouter();
  const locale = useLocale();
  const { items: cartItems, updateQuantity, removeItem, clearCart } = useCart();
  // Initialize delivery date as empty - user must select a date
  const [deliveryDate, setDeliveryDate] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const getItemImage = (item: CartItem) => {
    if (item.product?.images && item.product.images.length > 0) {
      const firstImage = item.product.images[0];
      if (
        typeof firstImage === "object" &&
        firstImage !== null &&
        "url" in firstImage
      ) {
        return firstImage.url;
      }
    }
    if (item.pot?.images && item.pot.images.length > 0) {
      const firstImage = item.pot.images[0];
      if (
        typeof firstImage === "object" &&
        firstImage !== null &&
        "url" in firstImage
      ) {
        return firstImage.url;
      }
    }
    return "/place_holder.png";
  };

  const getItemName = (item: CartItem) => {
    if (item.product) {
      return item.product.common_name || "Product";
    }
    if (item.pot) {
      return item.pot.name || "Pot";
    }
    return "Item";
  };

  const getItemId = (item: CartItem) => {
    if (item.product) {
      return item.product.productId || `#${item.product.id}`;
    }
    if (item.pot) {
      return item.pot.potId || `#${item.pot.id}`;
    }
    return "N/A";
  };

  const getItemType = (item: CartItem): "product" | "pot" => {
    return item.product ? "product" : "pot";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Store order data before clearing
    const orderData = {
      client: client.id,
      companyName: client.companyName,
      deliveryDate,
      items: cartItems
        .map((item) => {
          if (item.product) {
            return {
              itemType: "product" as const,
              product: item.product.id,
              quantity: item.quantity,
            };
          } else if (item.pot) {
            return {
              itemType: "pot" as const,
              pot: item.pot.id,
              quantity: item.quantity,
            };
          }
          return null;
        })
        .filter(
          (
            item,
          ): item is
            | { itemType: "product"; product: number; quantity: number }
            | { itemType: "pot"; pot: number; quantity: number } =>
            item !== null,
        ),
      notes: notes || undefined,
      status: "pending",
      locale: locale,
    };

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to submit order");
      }

      // Clear cart immediately for instant feedback
      clearCart();

      // Clear form fields immediately
      setDeliveryDate("");
      setNotes("");

      // Redirect immediately for smooth UX
      router.push("/client/orders");

      // Note: We don't set submitting to false here because we're redirecting
      // The state will be reset when the component unmounts
    } catch (error) {
      console.error("Order submission error:", error);
      const errorMessage =
        error instanceof Error ? error.message : t("submit_error");

      // Use a better error display instead of alert
      // Show error in the UI (you could add a state for this)
      alert(errorMessage); // Keep alert for now, but could be improved with a toast/notification

      setSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div>
        <div className="rounded-lg border border-muted bg-bg p-12 text-center">
          <ShoppingBag className="mx-auto mb-4 h-12 w-12 text-text/40" />
          <h3 className="mb-2 text-xl font-medium">{t("empty_title")}</h3>
          <p className="mb-4 text-text/70">{t("empty_desc")}</p>
          <div className="flex gap-2">
            <Button
              onClick={() => router.push("/client/products")}
              variant="primary"
            >
              {t("browse_products")}
            </Button>
            <Button
              onClick={() => router.push("/client/pots")}
              variant="primary"
            >
              {t("browse_pots")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Cart Items */}
        <div className="space-y-4">
          {cartItems.map((item) => {
            const itemId = item.product?.id || item.pot?.id || 0;
            const itemType = getItemType(item);
            const itemName = getItemName(item);
            const itemDisplayId = getItemId(item);
            const itemSize = item.pot?.size;

            return (
              <div
                key={`${itemType}-${itemId}`}
                className="flex gap-4 rounded-lg border border-muted bg-bg p-4 shadow"
              >
                <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
                  <Image
                    src={getItemImage(item) || "/place_holder.png"}
                    alt={itemName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-text">
                        {itemName}
                        {itemType === "pot" && itemSize && (
                          <span className="ml-2 text-sm font-normal text-text/70">
                            ({itemSize})
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-text/70">
                        {itemType === "product" ? "Product" : "Pot"} ID:{" "}
                        {itemDisplayId}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(itemId, itemType)}
                      className="text-red-600 hover:text-red-800"
                      aria-label={t("remove_item")}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-text/70">
                      {t("quantity")}:
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(itemId, item.quantity - 1, itemType)
                        }
                        className="flex h-8 w-8 items-center justify-center rounded border border-muted bg-bg text-text transition hover:bg-muted"
                        aria-label={t("decrease_quantity")}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(
                            itemId,
                            parseInt(e.target.value, 10) || 1,
                            itemType,
                          )
                        }
                        className="w-20 text-center"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(itemId, item.quantity + 1, itemType)
                        }
                        className="flex h-8 w-8 items-center justify-center rounded border border-muted bg-bg text-text transition hover:bg-muted"
                        aria-label={t("increase_quantity")}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Details */}
        <div className="rounded-lg border border-muted bg-bg p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold text-text">
            {t("order_details")}
          </h2>
          <div className="space-y-4">
            <div>
              <Input
                type="date"
                label={t("delivery_date_label")}
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-text/70 mb-1"
              >
                {t("notes_label")}
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder={t("notes_placeholder")}
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            loading={submitting}
            variant="primary"
            className="min-w-[200px]"
          >
            {t("submit_order")}
          </Button>
        </div>
      </form>
    </div>
  );
}
