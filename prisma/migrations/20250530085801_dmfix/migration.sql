/*
  Warnings:

  - Added the required column `pending` to the `CVersions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CVersions" ADD COLUMN     "pending" BOOLEAN NOT NULL;
