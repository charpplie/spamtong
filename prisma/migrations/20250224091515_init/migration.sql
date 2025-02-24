-- CreateTable
CREATE TABLE "Activities" (
    "id" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameFmt" TEXT NOT NULL,
    "links" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Activities_pkey" PRIMARY KEY ("id")
);
