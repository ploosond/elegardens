import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";

import { RxHeight, RxWidth } from "react-icons/rx";
import { PiSnowflakeThin } from "react-icons/pi";
import { IoSunnyOutline } from "react-icons/io5";
import BackButton from "@/components/ui/BackButton";
import ProductCard from "@/components/cards/ProductCard";

const PAYLOAD_API = process.env.NEXT_PUBLIC_PAYLOAD_URL;

import type { Product } from "@/payload-types";
import { Link } from "@/i18n/navigation";

async function getProduct(slug: string, _locale: string) {
  try {
    const url = new URL(`${PAYLOAD_API}/api/products`);
    url.searchParams.set("where[slug][equals]", slug);
    // Products collection doesn't use Payload's locale system
    // url.searchParams.set('locale', locale)

    const res = await fetch(url.toString(), {
      next: { revalidate: 0 },
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.docs?.[0] || null;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

async function getRelatedProducts(_locale: string, currentSlug: string) {
  try {
    const url = new URL(`${PAYLOAD_API}/api/products`);
    // Products collection doesn't use Payload's locale system
    // url.searchParams.set('locale', locale)
    url.searchParams.set("limit", "6");

    const res = await fetch(url.toString(), {
      next: { revalidate: 0 },
    });

    if (!res.ok) return [];
    const data = await res.json();
    return data.docs?.filter((p: Product) => p.slug !== currentSlug) || [];
  } catch (error) {
    console.error("Error fetching related products:", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const product = await getProduct(id, locale);
  if (!product) return {};

  const metaTitle =
    locale === "de"
      ? product.metaTitle_de || product.common_name
      : product.metaTitle_en || product.common_name;

  const metaDescription =
    locale === "de"
      ? product.metaDescription_de ||
        product.description_de ||
        product.description_en
      : product.metaDescription_en ||
        product.description_en ||
        product.description_de;

  return {
    title: metaTitle || "Product",
    description: metaDescription || "",
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id: slug } = await params;
  const t = await getTranslations("ProductPage");
  const product: Product | null = await getProduct(slug, locale);
  if (!product) {
    notFound();
  }
  const relatedProducts: Product[] = await getRelatedProducts(locale, slug);

  const productName = product.common_name?.trim() || "";
  const altText = productName;
  // Required fields (no optional chaining)
  const descEN = product.description_en.trim();
  const descDE = product.description_de.trim();
  const productDesc = locale === "de" ? descDE || descEN : descEN || descDE;
  const lightEN = product.light_en.trim();
  const lightDE = product.light_de.trim();
  const productLight =
    locale === "de" ? lightDE || lightEN : lightEN || lightDE;
  let imageUrl = "/place_holder.png";
  if (product.images && product.images.length > 0) {
    const firstImage = product.images[0];
    if (
      typeof firstImage === "object" &&
      firstImage !== null &&
      "url" in firstImage &&
      firstImage.url
    ) {
      imageUrl = firstImage.url;
    }
  }

  return (
    <div>
      <div className="mx-auto mt-8 px-4 sm:mt-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-24">
          <div className="flex flex-col items-start">
            <BackButton
              href={`/${locale}/products`}
              label={t("back_to_products")}
              className="mb-4"
            />

            <div className="flex w-full flex-col items-center gap-4">
              <div className="relative aspect-[2/3] w-full max-h-[480px] overflow-hidden rounded-lg bg-muted">
                <Image
                  src={imageUrl}
                  alt={altText}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="mb-10">
              <h1 className="mb-2 font-poppins text-2xl font-semibold text-primary sm:text-3xl">
                {productName}
              </h1>
              <hr className="border-muted/60 mb-6 border-0 border-b-2" />

              <div className="grid w-full grid-cols-2 gap-x-8 gap-y-6 rounded-lg bg-white p-6 shadow-lg sm:grid-cols-2 lg:grid-cols-2">
                <div className="flex items-center space-x-2">
                  <RxHeight className="h-8 w-8 rounded bg-muted p-1 text-primary" />
                  <p className="whitespace-nowrap">{t("height")}</p>
                </div>
                <div className="flex items-center font-semibold text-text">
                  {product.height ? `${product.height} cm` : "—"}
                </div>
                <div className="flex items-center space-x-2">
                  <RxWidth className="h-8 w-8 rounded bg-muted p-1 text-primary" />
                  <p className="whitespace-nowrap">{t("diameter")}</p>
                </div>
                <div className="flex items-center font-semibold text-text">
                  {product.diameter ? `${product.diameter} cm` : "—"}
                </div>

                <div className="flex items-center space-x-2">
                  <PiSnowflakeThin className="h-8 w-8 rounded bg-muted p-1 text-primary" />
                  <p className="whitespace-nowrap">{t("hardy")}</p>
                </div>
                <div className="flex items-center font-semibold text-text">
                  {product.hardiness ? `${product.hardiness}°C` : "—"}
                </div>
                <div className="flex items-center space-x-2">
                  <IoSunnyOutline className="h-8 w-8 rounded bg-muted p-1 text-primary" />
                  <p className="whitespace-nowrap">{t("light")}</p>
                </div>
                <div className="flex items-center font-semibold text-text">
                  {productLight || "—"}
                </div>
              </div>
            </div>
            <p className="text-justify leading-relaxed text-text">
              {productDesc}
            </p>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="mt-12 bg-white py-8 sm:py-12">
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 md:text-4xl">
                  {t("related_products")}
                </h2>
                <p className="mt-2 text-lg text-gray-600">
                  {t("you_might_also_like")}
                </p>
              </div>
              <Link
                href={`/${locale}/products`}
                className="hidden items-center text-primary transition-colors hover:text-primary-dark md:flex"
              >
                {t("view_all_products")}{" "}
                <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 gap-y-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
              {relatedProducts.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="mt-8 text-center md:hidden">
              <Link
                href={`/${locale}/products`}
                className="inline-flex items-center text-primary transition-colors hover:text-primary-dark"
              >
                {t("view_all_products")}{" "}
                <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
