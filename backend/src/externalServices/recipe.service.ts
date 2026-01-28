import axios from "axios";

const API_BASE = "https://api.spoonacular.com";

export const searchRecipesByIngredients = async (ingredients: string[]) => {
  const ingredientString = ingredients.join(",");

  const { data } = await axios.get(`${API_BASE}/recipes/findByIngredients`, {
    params: {
      ingredients: ingredientString,
      number: 6,
      ranking: 1,
      apiKey: process.env.SPOONACULAR_API_KEY,
    },
  });
  return data;
};

export const GetRecipeInformationBulk = async (ids: number[]) => {
  const { data } = await axios.get(`${API_BASE}/recipes/informationBulk`, {
    params: {
      ids: ids.join(","),
      apiKey: process.env.SPOONACULAR_API_KEY,
    },
  });

  return data;
};
