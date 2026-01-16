"use client";

import ClientSidebar from "@/components/ui/ClientSidebar";
import { CartProvider } from "@/contexts/CartContext";

interface ClientLayoutClientProps {
  children: React.ReactNode;
  locale: string;
}

export default function ClientLayoutClient({
  children,
}: ClientLayoutClientProps) {
  return (
    <CartProvider>
      <div className="flex min-h-screen bg-bg">
        <ClientSidebar />
        <main className="flex-1 lg:ml-64">
          <div className="px-4 py-6 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </CartProvider>
  );
}
