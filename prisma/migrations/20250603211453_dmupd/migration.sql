/*
  Warnings:

  - You are about to drop the column `pending` on the `pending_apps` table. All the data in the column will be lost.
  - Added the required column `pendingDs` to the `pending_apps` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pendingTg` to the `pending_apps` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "pending_apps" DROP COLUMN "pending",
ADD COLUMN     "pendingDs" BOOLEAN NOT NULL,
ADD COLUMN     "pendingTg" BOOLEAN NOT NULL;
