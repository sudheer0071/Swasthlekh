-- CreateTable
CREATE TABLE "AllowedAcess" (
    "id" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "doctor" TEXT NOT NULL,

    CONSTRAINT "AllowedAcess_pkey" PRIMARY KEY ("id")
);
