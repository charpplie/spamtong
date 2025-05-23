/*
  Warnings:

  - The `lastChangeNumber` column on the `CVersions` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "CVersions" DROP COLUMN "lastChangeNumber",
ADD COLUMN     "lastChangeNumber" INTEGER NOT NULL DEFAULT 0;
