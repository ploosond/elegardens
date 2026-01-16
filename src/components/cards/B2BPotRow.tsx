"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import type { Pot } from "@/payload-types";
import QuantityInput from "@/components/ui/QuantityInput";
import AvailabilityBadge from "@/components/ui/AvailabilityBadge";
import Button from "@/components/ui/Button";
import { useCart } from "@/contexts/CartContext";

interface B2BPotRowProps {
  pot: Pot;
}

export default function B2BPotRow({ pot }: B2BPotRowProps) {
  const t = useTranslations("B2BPots");
  const { items, addItem, updateQuantity } = useCart();
  const [localQuantity, setLocalQuantity] = useState(0);

  // Find if pot is already in cart
  const cartItem = items.find((item) => item.pot?.id === pot.id);
  const cartQuantity = cartItem?.quantity || 0;

  // Sync local quantity with cart quantity
  useEffect(() => {
    setLocalQuantity(cartQuantity);
  }, [cartQuantity]);

  const handleQuantityChange = (newQuantity: number) => {
    setLocalQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    if (localQuantity > 0) {
      if (cartItem) {
        // Update existing item
        updateQuantity(pot.id, localQuantity, "pot");
      } else {
        // Add new item
        addItem(pot, localQuantity);
      }
    } else if (cartItem && localQuantity === 0) {
      // Remove from cart
      updateQuantity(pot.id, 0, "pot");
    }
  };

  const isOutOfStock = pot.availability === "out-of-stock";
  const hasQuantity = localQuantity > 0 || cartQuantity > 0;

  return (
    <tr
      className={`border-b border-muted transition-colors ${
        hasQuantity ? "bg-primary/5" : "bg-bg hover:bg-muted/50"
      }`}
    >
      <td className="px-4 py-3">
        <span className="font-mono text-sm font-semibold text-text">
          {pot.potId || `#${pot.id}`}
        </span>
      </td>
      <td className="px-4 py-3">
        <span className="text-text">{pot.name || "Unnamed Pot"}</span>
      </td>
      <td className="px-4 py-3">
        <span className="text-text">{pot.size || "N/A"}</span>
      </td>
      <td className="px-4 py-3">
        <AvailabilityBadge availability={pot.availability || "available"} />
      </td>
      <td className="px-4 py-3">
        <QuantityInput
          value={localQuantity}
          onChange={handleQuantityChange}
          min={0}
          disabled={isOutOfStock}
          className="justify-center"
        />
      </td>
      <td className="px-4 py-3">
        <Button
          onClick={handleAddToCart}
          disabled={isOutOfStock || localQuantity === 0}
          variant={cartQuantity > 0 ? "secondary" : "primary"}
          className="min-w-[120px]"
        >
          {cartQuantity > 0 ? t("update_cart") : t("add_to_cart")}
        </Button>
      </td>
    </tr>
  );
}
