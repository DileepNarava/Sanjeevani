-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'FULFILLED');

-- AlterTable
ALTER TABLE "BloodRequest" ADD COLUMN     "status" "RequestStatus" NOT NULL DEFAULT 'PENDING';
