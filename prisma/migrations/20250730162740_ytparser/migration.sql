-- CreateTable
CREATE TABLE "youtube" (
    "id" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "videoCount" TEXT NOT NULL,
    "lastVideo" TEXT NOT NULL,

    CONSTRAINT "youtube_pkey" PRIMARY KEY ("id")
);
