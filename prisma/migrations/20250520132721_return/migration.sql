-- CreateTable
CREATE TABLE "CVersions" (
    "id" TEXT NOT NULL,
    "appId" TEXT NOT NULL,
    "lastVersion" TEXT NOT NULL,
    "lastVersionServer" TEXT NOT NULL,

    CONSTRAINT "CVersions_pkey" PRIMARY KEY ("id")
);
