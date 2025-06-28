/*
  Warnings:

  - You are about to drop the column `pendingDs` on the `pending_apps` table. All the data in the column will be lost.
  - You are about to drop the column `pendingTg` on the `pending_apps` table. All the data in the column will be lost.
  - Added the required column `pending` to the `pending_apps` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "pending_apps" DROP COLUMN "pendingDs",
DROP COLUMN "pendingTg",
ADD COLUMN     "pending" BOOLEAN NOT NULL;
