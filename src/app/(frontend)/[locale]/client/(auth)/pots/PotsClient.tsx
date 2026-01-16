"use client";

import { useMemo, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import B2BPotRow from "@/components/cards/B2BPotRow";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import { useCart } from "@/contexts/CartContext";
import { useDebounce } from "@/hooks/useDebounce";
import { X } from "lucide-react";
import type { Pot } from "@/payload-types";

interface PotsClientProps {
  initialPots: Pot[];
}

type AvailabilityFilter = "all" | "available" | "out-of-stock";

export default function PotsClient({ initialPots }: PotsClientProps) {
  const t = useTranslations("PotsPage");
  const tB2B = useTranslations("B2BPots");
  const router = useRouter();
  const { getTotalItems, getTotalProducts } = useCart();

  // Filter state
  const [potIdSearch, setPotIdSearch] = useState("");
  const [potNameSearch, setPotNameSearch] = useState("");
  const [sizeFilter, setSizeFilter] = useState("");
  const [availabilityFilter, setAvailabilityFilter] =
    useState<AvailabilityFilter>("all");

  // Debounce search inputs
  const debouncedPotIdSearch = useDebounce(potIdSearch, 300);
  const debouncedPotNameSearch = useDebounce(potNameSearch, 300);

  // Filter pots
  const filteredPots = useMemo(() => {
    let filtered = initialPots;

    // Filter by Pot ID
    if (debouncedPotIdSearch) {
      const term = debouncedPotIdSearch.toLowerCase();
      filtered = filtered.filter((pot) =>
        (pot.potId || "").toLowerCase().includes(term),
      );
    }

    // Filter by Pot Name
    if (debouncedPotNameSearch) {
      const term = debouncedPotNameSearch.toLowerCase();
      filtered = filtered.filter((pot) =>
        (pot.name || "").toLowerCase().includes(term),
      );
    }

    // Filter by Size
    if (sizeFilter) {
      filtered = filtered.filter((pot) => pot.size === sizeFilter);
    }

    // Filter by Availability
    if (availabilityFilter !== "all") {
      filtered = filtered.filter(
        (pot) => pot.availability === availabilityFilter,
      );
    }

    return filtered;
  }, [
    debouncedPotIdSearch,
    debouncedPotNameSearch,
    sizeFilter,
    availabilityFilter,
    initialPots,
  ]);

  // Get unique sizes for filter
  const availableSizes = useMemo(() => {
    const sizes = new Set(
      initialPots
        .map((pot) => pot.size)
        .filter((size): size is string => Boolean(size)),
    );
    return Array.from(sizes).sort();
  }, [initialPots]);

  const totalItems = getTotalItems();
  const totalProducts = getTotalProducts();

  const hasActiveFilters =
    potIdSearch || potNameSearch || sizeFilter || availabilityFilter !== "all";

  const clearFilters = () => {
    setPotIdSearch("");
    setPotNameSearch("");
    setSizeFilter("");
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
            {/* Pot ID Search */}
            <div className="w-full sm:w-32">
              <label className="mb-1 block text-xs font-medium text-text/70">
                {tB2B("filter_pot_id")}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={potIdSearch}
                  onChange={(e) => setPotIdSearch(e.target.value)}
                  placeholder={tB2B("search_by_id_placeholder")}
                  className="w-full rounded-md border border-muted bg-bg px-3 py-2 text-sm text-text placeholder:text-text/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {potIdSearch && (
                  <button
                    onClick={() => setPotIdSearch("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-text/50 hover:text-text"
                    aria-label="Clear Pot ID search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Pot Name Search */}
            <div className="w-full sm:w-64">
              <label className="mb-1 block text-xs font-medium text-text/70">
                {tB2B("filter_pot_name")}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={potNameSearch}
                  onChange={(e) => setPotNameSearch(e.target.value)}
                  placeholder={tB2B("search_by_name_placeholder")}
                  className="w-full rounded-md border border-muted bg-bg px-3 py-2 text-sm text-text placeholder:text-text/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {potNameSearch && (
                  <button
                    onClick={() => setPotNameSearch("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-text/50 hover:text-text"
                    aria-label="Clear Pot Name search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Size Filter */}
            {availableSizes.length > 0 && (
              <div className="w-full sm:w-auto">
                <label className="mb-1 block text-xs font-medium text-text/70 sm:mb-0">
                  {tB2B("filter_size")}
                </label>
                <select
                  value={sizeFilter}
                  onChange={(e) => setSizeFilter(e.target.value)}
                  className="rounded-md border border-muted bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">{tB2B("filter_all_sizes")}</option>
                  {availableSizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Availability Filter */}
            <div className="w-full sm:w-auto">
              <label className="mb-1 block text-xs font-medium text-text/70 sm:mb-0">
                {tB2B("filter_availability")}
              </label>
              <div className="flex gap-2">
                <button
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
              count: filteredPots.length,
              total: initialPots.length,
            })}
          </div>
        )}
      </div>

      {/* Pots Table - All pots on one page */}
      {filteredPots.length === 0 ? (
        <div className="rounded-lg border border-muted bg-bg p-12 text-center">
          <h3 className="mb-2 text-xl font-medium">{t("no_pots_title")}</h3>
          <p className="mb-4 text-text/70">{t("no_pots_desc")}</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-muted bg-bg">
          <table className="w-full">
            <thead className="bg-muted/50 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-text">
                  {tB2B("pot_id")}
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-text">
                  {tB2B("pot_name")}
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-text">
                  {tB2B("size")}
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
              {filteredPots.map((pot) => (
                <B2BPotRow key={pot.id} pot={pot} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
