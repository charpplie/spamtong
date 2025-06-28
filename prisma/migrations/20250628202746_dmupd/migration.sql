/*
  Warnings:

  - The primary key for the `cversions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `changeNumber` on the `cversions` table. All the data in the column will be lost.
  - You are about to drop the column `version` on the `cversions` table. All the data in the column will be lost.
  - You are about to drop the column `versionServer` on the `cversions` table. All the data in the column will be lost.
  - You are about to drop the `pending_apps` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `lastVersion` to the `cversions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastVersionServer` to the `cversions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "cversions" DROP CONSTRAINT "cversions_pkey",
DROP COLUMN "changeNumber",
DROP COLUMN "version",
DROP COLUMN "versionServer",
ADD COLUMN     "lastVersion" TEXT NOT NULL,
ADD COLUMN     "lastVersionServer" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "cversions_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "cversions_id_seq";

-- DropTable
DROP TABLE "pending_apps";

-- CreateTable
CREATE TABLE "bsky_profiles" (
    "id" TEXT NOT NULL,
    "did" TEXT NOT NULL,
    "handle" TEXT NOT NULL,
    "postsCount" INTEGER NOT NULL,

    CONSTRAINT "bsky_profiles_pkey" PRIMARY KEY ("id")
);
