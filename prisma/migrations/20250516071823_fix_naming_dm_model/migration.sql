/*
  Warnings:

  - You are about to drop the `IGC_Versions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "IGC_Versions";

-- CreateTable
CREATE TABLE "CVersions" (
    "id" TEXT NOT NULL,
    "appId" TEXT NOT NULL,
    "lastVersion" TEXT NOT NULL,
    "lastVersionServer" TEXT NOT NULL,

    CONSTRAINT "CVersions_pkey" PRIMARY KEY ("id")
);
