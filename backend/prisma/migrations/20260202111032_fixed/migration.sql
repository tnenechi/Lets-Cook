/*
  Warnings:

  - The primary key for the `Recipe` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Recipe` table. All the data in the column will be lost.
  - The primary key for the `SavedRecipe` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Made the column `externalId` on table `Recipe` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `recipeId` on the `SavedRecipe` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "SavedRecipe" DROP CONSTRAINT "SavedRecipe_recipeId_fkey";

-- AlterTable
ALTER TABLE "Recipe" DROP CONSTRAINT "Recipe_pkey",
DROP COLUMN "id",
ALTER COLUMN "externalId" SET NOT NULL;

-- AlterTable
ALTER TABLE "SavedRecipe" DROP CONSTRAINT "SavedRecipe_pkey",
DROP COLUMN "recipeId",
ADD COLUMN     "recipeId" INTEGER NOT NULL,
ADD CONSTRAINT "SavedRecipe_pkey" PRIMARY KEY ("userId", "recipeId");

-- AddForeignKey
ALTER TABLE "SavedRecipe" ADD CONSTRAINT "SavedRecipe_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("externalId") ON DELETE RESTRICT ON UPDATE CASCADE;
