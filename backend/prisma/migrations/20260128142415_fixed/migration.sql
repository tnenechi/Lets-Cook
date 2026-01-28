-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "glutenFree" BOOLEAN,
ADD COLUMN     "readyInMinutes" TEXT,
ADD COLUMN     "vegan" BOOLEAN,
ADD COLUMN     "vegetarian" BOOLEAN;
