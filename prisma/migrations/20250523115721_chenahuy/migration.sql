/*
  Warnings:

  - Made the column `lastChangeNumber` on table `CVersions` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "CVersions" ALTER COLUMN "lastChangeNumber" SET NOT NULL;
