-- CreateTable
CREATE TABLE "radio_emojis" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,

    CONSTRAINT "radio_emojis_pkey" PRIMARY KEY ("id")
);
