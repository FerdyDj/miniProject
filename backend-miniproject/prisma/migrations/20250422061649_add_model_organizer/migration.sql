-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "voucher" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Organizer" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "fullname" TEXT NOT NULL,
    "avatar" TEXT DEFAULT 'https://res.cloudinary.com/dexlqslwj/image/upload/v1745302397/avataro_rbkxbm.svg',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organizer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Organizer_email_key" ON "Organizer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Organizer_username_key" ON "Organizer"("username");
