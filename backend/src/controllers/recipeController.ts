import type { Request, Response } from "express";
import { Send } from "../utils/response.js";
import {
  GetRecipeInformationBulk,
  searchRecipesByIngredients,
} from "../externalServices/recipe.service.js";
import { prisma } from "../../lib/prisma.js";

type Recipe = {
  id: number;
  image: string;
};

type RecipeInfo = {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  sourceUrl: string;
  summary: string;
  glutenFree: boolean;
  vegan: boolean;
  vegetarian: boolean;
};

export const searchRecipes = async (req: Request, res: Response) => {
  const ingredientsParam = req.query.ingredients as string;

  if (!ingredientsParam) {
    return Send.error(res, "Ingredients query parameter is required");
  }

  const ingredients = ingredientsParam
    .split(",")
    .map((ing) => ing.trim().toLowerCase());

  const recipes: Recipe[] = await searchRecipesByIngredients(ingredients);

  const recipeIds = recipes.map((recipe) => recipe.id);

  const recipesInfo: RecipeInfo[] = await GetRecipeInformationBulk(recipeIds);

  return Send.success(res, { recipesInfo });
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
      readyInMinutes: recipeData.readyInMinutes,
      sourceUrl: recipeData.sourceUrl,
      summary: recipeData.summary,
      glutenFree: recipeData.glutenFree,
      vegan: recipeData.vegan,
      vegetarian: recipeData.vegetarian,
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
