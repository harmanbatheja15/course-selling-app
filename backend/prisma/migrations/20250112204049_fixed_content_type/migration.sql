/*
  Warnings:

  - Changed the type of `type` on the `CourseContent` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('VIDEO', 'NOTES');

-- AlterTable
ALTER TABLE "CourseContent" DROP COLUMN "type",
ADD COLUMN     "type" "ContentType" NOT NULL;

-- DropEnum
DROP TYPE "ContentTypes";
