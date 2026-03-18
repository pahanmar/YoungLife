-- CreateTable
CREATE TABLE "RoutePermission" (
    "id" SERIAL NOT NULL,
    "path" TEXT NOT NULL,
    "mode" TEXT NOT NULL DEFAULT 'all',
    "roles" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "RoutePermission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RoutePermission_path_key" ON "RoutePermission"("path");
