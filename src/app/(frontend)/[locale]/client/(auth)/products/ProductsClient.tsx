"use client";

import { useMemo, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import B2BProductRow from "@/components/cards/B2BProductRow";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import { useCart } from "@/contexts/CartContext";
import { useDebounce } from "@/hooks/useDebounce";
import { X } from "lucide-react";
import type { Product } from "@/payload-types";

interface ProductsClientProps {
  initialProducts: Product[];
}

type AvailabilityFilter = "all" | "available" | "out-of-stock";

export default function ProductsClient({
  initialProducts,
}: ProductsClientProps) {
  const t = useTranslations("ProductsPage");
  const tB2B = useTranslations("B2BProducts");
  const router = useRouter();
  const { getTotalItems, getTotalProducts } = useCart();

  // Filter state
  const [productIdSearch, setProductIdSearch] = useState("");
  const [productNameSearch, setProductNameSearch] = useState("");
  const [availabilityFilter, setAvailabilityFilter] =
    useState<AvailabilityFilter>("all");

  // Debounce search inputs
  const debouncedProductIdSearch = useDebounce(productIdSearch, 300);
  const debouncedProductNameSearch = useDebounce(productNameSearch, 300);

  // Filter products
  const filteredProducts = useMemo(() => {
    let filtered = initialProducts;

    // Filter by Product ID
    if (debouncedProductIdSearch) {
      const term = debouncedProductIdSearch.toLowerCase();
      filtered = filtered.filter((product) =>
        (product.productId || "").toLowerCase().includes(term),
      );
    }

    // Filter by Product Name
    if (debouncedProductNameSearch) {
      const term = debouncedProductNameSearch.toLowerCase();
      filtered = filtered.filter((product) =>
        (product.common_name || "").toLowerCase().includes(term),
      );
    }

    // Filter by Availability
    if (availabilityFilter !== "all") {
      filtered = filtered.filter(
        (product) => product.availability === availabilityFilter,
      );
    }

    return filtered;
  }, [
    debouncedProductIdSearch,
    debouncedProductNameSearch,
    availabilityFilter,
    initialProducts,
  ]);

  const totalItems = getTotalItems();
  const totalProducts = getTotalProducts();

  const hasActiveFilters =
    productIdSearch || productNameSearch || availabilityFilter !== "all";

  const clearFilters = () => {
    setProductIdSearch("");
    setProductNameSearch("");
    setAvailabilityFilter("all");
  };

  return (
    <div>
      {/* Cart Summary */}
      <div className="mb-6 rounded-lg border border-primary/20 bg-primary/5 p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="font-semibold text-text">
              {tB2B("total_items", { count: totalItems })}
            </span>
            <span className="text-text/70">
              {tB2B("total_products", { count: totalProducts })}
            </span>
          </div>
          {totalItems > 0 && (
            <Button
              onClick={() => router.push("/client/cart")}
              variant="primary"
            >
              {tB2B("view_cart")}
            </Button>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="mb-6 rounded-lg border border-muted bg-bg p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:gap-4">
          {/* Search Inputs */}
          <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-end">
            {/* Product ID Search */}
            <div className="w-full sm:w-32">
              <label
                htmlFor="product-id-search"
                className="mb-1 block text-xs font-medium text-text/70"
              >
                {tB2B("filter_product_id")}
              </label>
              <div className="relative">
                <input
                  id="product-id-search"
                  type="text"
                  value={productIdSearch}
                  onChange={(e) => setProductIdSearch(e.target.value)}
                  placeholder={tB2B("search_by_id_placeholder")}
                  className="w-full rounded-md border border-muted bg-bg px-3 py-2 text-sm text-text placeholder:text-text/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {productIdSearch && (
                  <button
                    type="button"
                    onClick={() => setProductIdSearch("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-text/50 hover:text-text"
                    aria-label="Clear Product ID search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Product Name Search */}
            <div className="w-full sm:w-64">
              <label
                htmlFor="product-name-search"
                className="mb-1 block text-xs font-medium text-text/70"
              >
                {tB2B("filter_product_name")}
              </label>
              <div className="relative">
                <input
                  id="product-name-search"
                  type="text"
                  value={productNameSearch}
                  onChange={(e) => setProductNameSearch(e.target.value)}
                  placeholder={tB2B("search_by_name_placeholder")}
                  className="w-full rounded-md border border-muted bg-bg px-3 py-2 text-sm text-text placeholder:text-text/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {productNameSearch && (
                  <button
                    type="button"
                    onClick={() => setProductNameSearch("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-text/50 hover:text-text"
                    aria-label="Clear Product Name search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Availability Filter */}
            <div className="w-full sm:w-auto">
              <div className="mb-1 block text-xs font-medium text-text/70 sm:mb-0">
                {tB2B("filter_availability")}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setAvailabilityFilter("all")}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    availabilityFilter === "all"
                      ? "bg-primary text-white"
                      : "bg-muted text-text hover:bg-muted/80"
                  }`}
                >
                  {tB2B("filter_all")}
                </button>
                <button
                  type="button"
                  onClick={() => setAvailabilityFilter("available")}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    availabilityFilter === "available"
                      ? "bg-primary text-white"
                      : "bg-muted text-text hover:bg-muted/80"
                  }`}
                >
                  {tB2B("filter_available")}
                </button>
                <button
                  type="button"
                  onClick={() => setAvailabilityFilter("out-of-stock")}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    availabilityFilter === "out-of-stock"
                      ? "bg-primary text-white"
                      : "bg-muted text-text hover:bg-muted/80"
                  }`}
                >
                  {tB2B("filter_out_of_stock")}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <div className="mt-4 flex justify-end">
            <Button
              onClick={clearFilters}
              variant="secondary"
              className="whitespace-nowrap"
            >
              {tB2B("clear_filters")}
            </Button>
          </div>
        )}

        {/* Results Count */}
        {hasActiveFilters && (
          <div className="mt-4 text-sm text-text/70">
            {tB2B("showing_results", {
              count: filteredProducts.length,
              total: initialProducts.length,
            })}
          </div>
        )}
      </div>

      {/* Products Table - All products on one page */}
      {filteredProducts.length === 0 ? (
        <div className="rounded-lg border border-muted bg-bg p-12 text-center">
          <h3 className="mb-2 text-xl font-medium">{t("no_products_title")}</h3>
          <p className="mb-4 text-text/70">{t("no_products_desc")}</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-muted bg-bg">
          <table className="w-full">
            <thead className="bg-muted/50 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-text">
                  {tB2B("product_id")}
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-text">
                  {tB2B("product_name")}
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-text">
                  {tB2B("availability")}
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-text">
                  {tB2B("quantity")}
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-text">
                  {tB2B("action")}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <B2BProductRow key={product.id} product={product} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
