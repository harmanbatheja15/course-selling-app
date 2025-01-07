-- CreateEnum
CREATE TYPE "Type" AS ENUM ('LIVE', 'RECORDED');

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "type" "Type";

-- AlterTable
ALTER TABLE "Instructor" ADD COLUMN     "logo" TEXT;
