/*
  Warnings:

  - You are about to drop the `CVersions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "CVersions";

-- CreateTable
CREATE TABLE "cversions" (
    "id" SERIAL NOT NULL,
    "appId" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "versionServer" TEXT NOT NULL,
    "changeNumber" BIGINT,

    CONSTRAINT "cversions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pending_apps" (
    "id" SERIAL NOT NULL,
    "appId" TEXT NOT NULL,
    "oldVer" TEXT NOT NULL,
    "newVer" TEXT NOT NULL,
    "pendindDs" BOOLEAN NOT NULL,
    "pendingTg" BOOLEAN NOT NULL,

    CONSTRAINT "pending_apps_pkey" PRIMARY KEY ("id")
);
