/*
  Warnings:

  - You are about to drop the column `candyId` on the `Item` table. All the data in the column will be lost.
  - Added the required column `ingredients` to the `Candy` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_candyId_fkey";

-- AlterTable
ALTER TABLE "Candy" ADD COLUMN     "ingredients" TEXT NOT NULL,
ALTER COLUMN "directions" SET NOT NULL,
ALTER COLUMN "directions" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "candyId";
