-- CreateTable
CREATE TABLE "media" (
    "id" SERIAL NOT NULL,
    "refType" TEXT NOT NULL,
    "refId" INTEGER,
    "alt" TEXT,
    "filename" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);
