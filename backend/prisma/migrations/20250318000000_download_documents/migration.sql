-- CreateTable
CREATE TABLE "DownloadDocument" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "iconPath" TEXT,
    "filePath" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DownloadDocument_pkey" PRIMARY KEY ("id")
);
