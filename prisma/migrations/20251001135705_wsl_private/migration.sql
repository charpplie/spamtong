-- CreateTable
CREATE TABLE "wls_private" (
    "id" TEXT NOT NULL,
    "discord" TEXT NOT NULL,
    "telegram" TEXT NOT NULL,
    "added" BOOLEAN NOT NULL,

    CONSTRAINT "wls_private_pkey" PRIMARY KEY ("id")
);
