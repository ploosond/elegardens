"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Mail, Lock, AlertCircle } from "lucide-react";

interface LoginClientProps {
  locale: string;
}

export default function LoginClient({ locale }: LoginClientProps) {
  const t = useTranslations("ClientLogin");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/client/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important: include cookies
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || t("error_generic"));
        setLoading(false);
        return;
      }

      // Store user data in localStorage for client-side access
      if (data.user) {
        localStorage.setItem("client_user", JSON.stringify(data.user));
      }

      // Small delay to ensure cookie is set before redirect
      await new Promise((resolve) => setTimeout(resolve, 100));

      router.push("/client/dashboard");
    } catch (err: any) {
      console.error("Login error:", err);
      setError(t("error_network"));
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-800">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <Input
          type="email"
          label={t("email_label")}
          placeholder={t("email_placeholder")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          icon={<Mail className="h-4 w-4 text-gray-400" />}
          disabled={loading}
        />
      </div>

      <div>
        <Input
          type="password"
          label={t("password_label")}
          placeholder={t("password_placeholder")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          icon={<Lock className="h-4 w-4 text-gray-400" />}
          disabled={loading}
        />
      </div>

      <Button
        type="submit"
        loading={loading}
        disabled={loading}
        className="w-full"
      >
        {t("submit_button")}
      </Button>

      <p className="text-center text-xs text-text/60">
        {t("help_text")}{" "}
        <a
          href={`/${locale}/contact`}
          className="font-semibold text-primary hover:underline"
        >
          {t("contact_link")}
        </a>
      </p>
    </form>
  );
}
