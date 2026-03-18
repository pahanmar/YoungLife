-- AlterTable
ALTER TABLE "Book" ADD COLUMN "downloadMode" TEXT NOT NULL DEFAULT 'inherit';
ALTER TABLE "Book" ADD COLUMN "downloadRoles" TEXT[] DEFAULT ARRAY[]::TEXT[];
