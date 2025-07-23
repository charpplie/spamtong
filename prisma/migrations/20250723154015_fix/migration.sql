/*
  Warnings:

  - You are about to drop the `msdevblgos` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "msdevblgos";

-- CreateTable
CREATE TABLE "msdevblogs" (
    "id" TEXT NOT NULL,
    "blog" TEXT NOT NULL,
    "lastPost" TEXT NOT NULL,

    CONSTRAINT "msdevblogs_pkey" PRIMARY KEY ("id")
);
