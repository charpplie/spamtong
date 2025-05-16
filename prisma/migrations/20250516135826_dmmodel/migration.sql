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

-- CreateTable
CREATE TABLE "CVersions" (
    "id" TEXT NOT NULL,
    "appId" TEXT NOT NULL,
    "lastVersion" TEXT NOT NULL,
    "lastVersionServer" TEXT NOT NULL,

    CONSTRAINT "CVersions_pkey" PRIMARY KEY ("id")
);
