-- DropForeignKey
ALTER TABLE "Lead" DROP CONSTRAINT "Lead_propertyId_fkey";

-- AlterTable
ALTER TABLE "Lead" ALTER COLUMN "propertyId" DROP NOT NULL,
ALTER COLUMN "phone" DROP NOT NULL,
ALTER COLUMN "email" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE SET NULL ON UPDATE CASCADE;
