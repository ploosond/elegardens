-- CreateTable
CREATE TABLE "public"."Project" (
    "id" SERIAL NOT NULL,
    "client" TEXT NOT NULL,
    "title" JSONB NOT NULL,
    "category" JSONB NOT NULL,
    "tagline" JSONB NOT NULL,
    "image" TEXT NOT NULL,
    "sections" JSONB NOT NULL,
    "displayRank" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);
