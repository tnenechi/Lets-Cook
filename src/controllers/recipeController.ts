import type { Request, Response } from "express";
import { Send } from "../utils/response.js";
import { searchRecipesByIngredients } from "../externalServices/recipe.service.js";
import { prisma } from "../../lib/prisma.js";

export const searchRecipes = async (req: Request, res: Response) => {
  const ingredientsParam = req.query.ingredients as string;

  if (!ingredientsParam) {
    return Send.error(res, "Ingredients query parameter is required");
  }

  const ingredients = ingredientsParam
    .split(",")
    .map((ing) => ing.trim().toLowerCase());

  const recipes = await searchRecipesByIngredients(ingredients);

  return Send.success(res, { recipes });
};

export const saveRecipe = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const recipeData = req.body;

  //save the recipe if it doesn't exist
  const savedRecipe = await prisma.recipe.upsert({
    where: { externalId: recipeData.id },
    update: {},
    create: {
      externalId: recipeData.id,
      title: recipeData.title,
      imageUrl: recipeData.image,
      instructions: recipeData.instructions ?? null,
    },
  });

  //link the recipe to the user
  await prisma.savedRecipe.upsert({
    where: {
      userId_recipeId: {
        userId: user.id,
        recipeId: savedRecipe.id,
      },
    },
    update: {},
    create: {
      userId: user.id,
      recipeId: savedRecipe.id,
    },
  });

  return Send.success(res, { message: "Recipe saved successfully" });
};

export const getSavedRecipes = async (req: Request, res: Response) => {
  const user = (req as any).user;

  const savedRecipes = await prisma.savedRecipe.findMany({
    where: {
      userId: user.id,
    },
    include: {
      recipe: true,
    },
  });

  return Send.success(res, { savedRecipes });
};

export const getSavedRecipeById = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const recipeId = req.params.id;
  
  const savedRecipe = await prisma.savedRecipe.findUnique({
    where: {
      userId_recipeId: {
        userId: user.id,
        recipeId: recipeId as string,
      },
    },
    include: {
      recipe: true,
    },
  });
  if (!savedRecipe) {
    return Send.error(res, "Recipe not found", 404);
  }
  return Send.success(res, { savedRecipe });
};

export const deleteSavedRecipe = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const recipeId = req.params.id;

  await prisma.savedRecipe.delete({
    where: {
      userId_recipeId: {
        userId: user.id,
        recipeId: recipeId as string,
      },
    },
  });

  return Send.success(res, { message: "Recipe deleted successfully" });
};
