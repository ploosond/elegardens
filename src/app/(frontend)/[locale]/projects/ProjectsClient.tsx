"use client";

import Link from "next/link";
import ProjectCard from "@/components/cards/ProjectCard";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";

interface ProjectsClientProps {
  initialProjects: any[];
}

export default function ProjectsClient({
  initialProjects,
}: ProjectsClientProps) {
  const t = useTranslations("ProjectsPage");
  const locale = useLocale();

  // Pagination
  const [page, setPage] = useState(1);

  // Client-side pagination
  const itemsPerPage = 12;
  const totalPages = Math.ceil(initialProjects.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProjects = initialProjects.slice(startIndex, endIndex);

  // Calculate visible page numbers (max 3)
  const visiblePages = useMemo(() => {
    if (totalPages <= 3)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page === 1) return [1, 2, 3];
    if (page === totalPages)
      return [totalPages - 2, totalPages - 1, totalPages];
    return [page - 1, page, page + 1];
  }, [page, totalPages]);

  return (
    <>
      {/* Project Grid */}
      <div className="mx-auto px-4 py-8 sm:px-6 sm:py-12">
        {paginatedProjects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg font-semibold text-gray-900">
              {t("no_projects_title")}
            </p>
            <p className="mt-2 text-gray-500">{t("no_projects_desc")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedProjects.map((project) => (
              <Link
                key={project.id}
                href={`/${locale}/projects/${project.slug}`}
              >
                <ProjectCard project={project} />
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 pb-8">
          {visiblePages.map((p) => (
            <button
              key={p}
              className={`rounded px-3 py-1 text-sm font-semibold transition-colors cursor-pointer ${
                p === page
                  ? "bg-primary text-white"
                  : "bg-white/10 text-primary hover:bg-primary/10"
              }`}
              onClick={() => setPage(p)}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
