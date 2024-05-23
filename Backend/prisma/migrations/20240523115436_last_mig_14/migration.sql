-- CreateTable
CREATE TABLE "Requests" (
    "id" TEXT NOT NULL,
    "doctor" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "grant" BOOLEAN NOT NULL,

    CONSTRAINT "Requests_pkey" PRIMARY KEY ("id")
);
