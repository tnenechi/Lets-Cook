import type { Request, Response } from "express";
import { Send } from "../utils/response.js";
import {
  GetRecipeInformationBulk,
  searchRecipesByIngredients,
} from "../externalServices/recipe.service.js";
import { prisma } from "../lib/prisma.js";
import {
  getRemainingTime,
  isQuotaBlocked,
  setQuotaResetTime,
} from "../utils/quotaTracker.js";

type RecipeInfo = {
  id: number;
  title: string;
  imageUrl: string;
  readyInMinutes: number;
  sourceUrl: string;
  summary: string;
  glutenFree: boolean;
  vegan: boolean;
  vegetarian: boolean;
};

export const searchRecipes = async (req: Request, res: Response) => {
  if (isQuotaBlocked()) {
    const remainingTime = getRemainingTime();
    return Send.dailyQuotaReached(res, remainingTime);
  }

  try {
    const ingredientsParam = req.query.ingredients as string;

    if (!ingredientsParam) {
      return Send.error(res, "Ingredients query parameter is required");
    }

    const ingredients = ingredientsParam
      .split(",")
      .map((ing) => ing.trim().toLowerCase());

    const result = await searchRecipesByIngredients(ingredients);
    const recipes: RecipeInfo[] = result.data;
    const headers = result.headers;

    // CHECK QUOTA LEFT
    const quotaLeft = Number(headers["x-api-quota-left"]);

    console.log("Quota left:", quotaLeft);

    if (quotaLeft <= 5) {
      setQuotaResetTime();
      console.log("Quota low, reset timer started");
    }

    const recipeIds = recipes.map((recipe) => recipe.id);

    const recipesInfo: RecipeInfo[] = await GetRecipeInformationBulk(recipeIds);

    return Send.success(res, { recipesInfo });
  } catch (error: any) {
    if (error.response && error.response.status === 402) {
      let remainingTime = getRemainingTime();

      if (remainingTime === 0) {
        setQuotaResetTime();
        remainingTime = getRemainingTime();
      }

      return Send.dailyQuotaReached(res, remainingTime);
    }

    return Send.error(res);
  }
};

export const saveRecipe = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const recipeData = req.body;

  console.log("****RECIPE DATA: \n", recipeData);

  //save the recipe if it doesn't exist
  const savedRecipe = await prisma.recipe.upsert({
    where: { externalId: recipeData.id },
    update: {},
    create: {
      externalId: recipeData.id,
      title: recipeData.title,
      imageUrl: recipeData.imageUrl,
      readyInMinutes: recipeData.readyInMinutes,
      sourceUrl: recipeData.sourceUrl,
      summary: recipeData.summary,
      glutenFree: recipeData.glutenFree,
      vegan: recipeData.vegan,
      vegetarian: recipeData.vegetarian,
    },
  });

  if (savedRecipe.externalId) {
    //link the recipe to the user
    await prisma.savedRecipe.upsert({
      where: {
        userId_recipeId: {
          userId: user.id,
          recipeId: savedRecipe.externalId,
        },
      },
      update: {},
      create: {
        userId: user.id,
        recipeId: savedRecipe.externalId,
      },
    });
  }

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

export const deleteSavedRecipe = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const recipeId = Number(req.params.recipeId);

  console.log("*******THE RECIPE ID: \n", recipeId);

  await prisma.savedRecipe.delete({
    where: {
      userId_recipeId: {
        userId: user.id,
        recipeId: recipeId,
      },
    },
  });

  return Send.success(res, { message: "Recipe deleted successfully" });
};

// export const getSavedRecipeById = async (req: Request, res: Response) => {
//   const user = (req as any).user;
//   const recipeId = Number(req.params.id);

//   const savedRecipe = await prisma.savedRecipe.findUnique({
//     where: {
//       userId_recipeId: {
//         userId: user.id,
//         recipeId: recipeId,
//       },
//     },
//     include: {
//       recipe: true,
//     },
//   });
//   if (!savedRecipe) {
//     return Send.error(res, "Recipe not found", 404);
//   }
//   return Send.success(res, { savedRecipe });
// };
