"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter, Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import {
  User,
  Leaf,
  Box,
  ShoppingCart,
  ShoppingBag,
  LogOut,
  Menu,
  X,
  Languages,
} from "lucide-react";
import Button from "./Button";

export default function ClientSidebar() {
  const t = useTranslations("ClientSidebar");
  const tHeader = useTranslations("Header");
  const pathname = usePathname();
  const router = useRouter();
  const currentLocale = useLocale();
  const nextLocale = currentLocale === "de" ? "en" : "de";
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Close sidebar on mobile when route changes
  useEffect(() => {
    setIsOpen(false);
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    
    // Clear localStorage immediately for instant feedback
    localStorage.removeItem("client_user");
    localStorage.removeItem("client_cart");
    
    // Redirect immediately for smooth UX (optimistic update)
    router.push("/client/login");
    
    // Handle logout API call in background (don't wait for it)
    fetch("/api/client/logout", {
      method: "POST",
      credentials: "include",
    }).catch((error) => {
      // Silently handle errors - user is already logged out locally
      console.error("Logout API error (non-critical):", error);
    });
    
    // Reset loading state after a brief moment
    setTimeout(() => {
      setLoading(false);
    }, 300);
  };

  const navItems = [
    {
      name: t("account"),
      href: "/client/dashboard",
      icon: User,
    },
    {
      name: t("plants"),
      href: "/client/products",
      icon: Leaf,
    },
    {
      name: t("pots"),
      href: "/client/pots",
      icon: Box,
    },
    {
      name: t("cart"),
      href: "/client/cart",
      icon: ShoppingBag,
    },
    {
      name: t("orders"),
      href: "/client/orders",
      icon: ShoppingCart,
    },
  ];

  const isActive = (href: string) => {
    if (href === "/client/dashboard") {
      return pathname === "/client/dashboard";
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-4 top-4 z-50 flex items-center rounded-md border border-muted bg-bg p-2 text-text transition hover:bg-muted focus:outline-none lg:hidden"
        aria-label="Toggle sidebar"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-64 transform border-r border-muted bg-bg transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex h-full flex-col pt-4">
          {/* Navigation items */}
          <nav className="flex-1 space-y-1 px-4 py-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <button
                  key={item.href}
                  onClick={() => router.push(item.href)}
                  className={`group relative flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors ${
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-text hover:bg-muted"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="flex-1 font-medium">{item.name}</span>
                </button>
              );
            })}
          </nav>

          {/* Language Switcher and Logout */}
          <div className="border-t border-muted p-4 space-y-3">
            <Link
              href={pathname || "/"}
              locale={nextLocale}
              className="inline-flex w-full items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow transition-colors duration-150 hover:bg-blue-700"
              title={tHeader("languageSwitcher")}
            >
              <Languages className="mr-2 h-4 w-4" />
              {nextLocale === "de" ? "DEU" : "ENG"}
            </Link>
            <Button
              onClick={handleLogout}
              loading={loading}
              variant="secondary"
              icon={<LogOut className="h-4 w-4" />}
              className="w-full bg-red-600 hover:bg-red-700 text-white border-red-600"
            >
              {t("logout")}
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
