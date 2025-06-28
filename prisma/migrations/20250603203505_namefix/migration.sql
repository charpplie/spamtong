/*
  Warnings:

  - You are about to drop the column `pendindDs` on the `pending_apps` table. All the data in the column will be lost.
  - Added the required column `pendingDs` to the `pending_apps` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "pending_apps" DROP COLUMN "pendindDs",
ADD COLUMN     "pendingDs" BOOLEAN NOT NULL;
