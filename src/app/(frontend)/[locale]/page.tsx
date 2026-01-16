import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import HomeClient from "./HomeClient";
import type { Employee, Product } from "@/payload-types";

const PAYLOAD_API = process.env.NEXT_PUBLIC_PAYLOAD_URL;

async function getProducts(_locale: string): Promise<Product[]> {
  try {
    const url = new URL(`${PAYLOAD_API}/api/products`);
    // Products collection doesn't use Payload's locale system - it uses _en/_de fields
    // url.searchParams.set('locale', locale)
    url.searchParams.set("limit", "10");
    url.searchParams.set("sort", "common_name");
    url.searchParams.set("depth", "2");

    const res = await fetch(url.toString(), {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return [];
    const data = await res.json();
    return data.docs || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

async function getEmployees(locale: string): Promise<Employee[]> {
  try {
    const url = new URL(`${PAYLOAD_API}/api/employees`);
    url.searchParams.set("locale", locale);
    url.searchParams.set("limit", "10");
    url.searchParams.set("sort", "createdAt");

    const res = await fetch(url.toString(), {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return [];
    const data = await res.json();
    return data.docs || [];
  } catch (error) {
    console.error("Error fetching employees:", error);
    return [];
  }
}

// Get video URL from environment variable (Cloudinary URL)
function getVideoData() {
  const videoUrl = process.env.NEXT_PUBLIC_HOME_VIDEO_URL || "";

  // Generate poster/thumbnail URL from Cloudinary video URL
  // Cloudinary can extract a frame from video by using /image/upload/ instead of /video/upload/
  // and adding so_0 (start offset at 0 seconds) to get the first frame
  let posterUrl = "";
  if (videoUrl) {
    try {
      // Extract the path after /video/upload/
      const urlMatch = videoUrl.match(/\/video\/upload\/(.+)/);
      if (urlMatch) {
        const _pathAfterUpload = urlMatch[1];
        // Replace /video/upload/ with /image/upload/ and add thumbnail transformation
        // so_0 = start offset 0 seconds (first frame), w_1920 = width, h_1080 = height, c_fill = crop fill
        posterUrl = videoUrl.replace(
          "/video/upload/",
          "/image/upload/so_0,w_1920,h_1080,c_fill,q_auto,f_auto/",
        );
      }
    } catch (error) {
      // If URL parsing fails, leave posterUrl empty
      console.error("Error generating poster URL:", error);
    }
  }

  return {
    videoUrl,
    videoTitle: process.env.NEXT_PUBLIC_HOME_VIDEO_TITLE || "Elegardens",
    posterUrl,
  };
}

async function getAnnouncementBanner(locale: string) {
  try {
    // Use 30 second cache for balance between performance and freshness
    // Banner changes will appear within 30 seconds instead of 1 hour
    const res = await fetch(
      `${PAYLOAD_API}/api/globals/announcement-banner?locale=${locale}`,
      {
        next: { revalidate: 30 }, // Cache for 30 seconds - good balance
      },
    );

    if (!res.ok) return null;
    const data = await res.json();

    // Check if banner is enabled
    if (!data.enabled) return null;

    // Get announcements array (now contains both en and de in each item)
    const announcements = data.announcements || [];

    // Return null if no announcements
    if (!announcements || announcements.length === 0) return null;

    // Extract text based on locale from each announcement object
    const announcementTexts = announcements
      .map((item: { text_en?: string; text_de?: string }) => {
        if (locale === "de") {
          return item.text_de || item.text_en || "";
        }
        return item.text_en || item.text_de || "";
      })
      .filter((text: string) => Boolean(text));

    if (announcementTexts.length === 0) return null;

    return {
      announcements: announcementTexts,
      backgroundColor: data.backgroundColor || "#0b7a43",
      textColor: data.textColor || "#ffffff",
      fontWeight: (data.fontWeight || "bold") as
        | "semibold"
        | "bold"
        | "extrabold",
      showOnDesktop: data.showOnDesktop !== false,
      showOnMobile: data.showOnMobile !== false,
      speed: (data.speed || "medium") as "slow" | "medium" | "fast",
    };
  } catch (error) {
    console.error("Error fetching announcement banner:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "HomePage" });

  return {
    title: `${t("heroTitle1")} ${t("heroTitle2")} - Elegardens`,
    description: t("heroSubtitle"),
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Fetch data in parallel (no video API call needed)
  const [products, employees, bannerData] = await Promise.all([
    getProducts(locale),
    getEmployees(locale),
    getAnnouncementBanner(locale),
  ]);

  // Get video data from environment variable (instant, no API call)
  const videoData = getVideoData();

  return (
    <HomeClient
      products={products}
      employees={employees}
      videoUrl={videoData.videoUrl}
      videoTitle={videoData.videoTitle}
      posterUrl={videoData.posterUrl}
      bannerData={bannerData}
    />
  );
}
