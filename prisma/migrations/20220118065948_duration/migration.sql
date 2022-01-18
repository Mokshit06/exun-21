-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "duration" INTEGER,
ALTER COLUMN "dueDate" DROP NOT NULL;

-- CreateTable
CREATE TABLE "CandyTrial" (
    "id" TEXT NOT NULL,
    "candyId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CandyTrial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CandyTrialToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CandyTrialToUser_AB_unique" ON "_CandyTrialToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_CandyTrialToUser_B_index" ON "_CandyTrialToUser"("B");

-- AddForeignKey
ALTER TABLE "CandyTrial" ADD CONSTRAINT "CandyTrial_candyId_fkey" FOREIGN KEY ("candyId") REFERENCES "Candy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CandyTrialToUser" ADD FOREIGN KEY ("A") REFERENCES "CandyTrial"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CandyTrialToUser" ADD FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
