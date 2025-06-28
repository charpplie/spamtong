/*
  Warnings:

  - The `changeNumber` column on the `cversions` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "cversions" DROP COLUMN "changeNumber",
ADD COLUMN     "changeNumber" INTEGER;
