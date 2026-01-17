import axios from "axios";

const API_BASE = "https://api.spoonacular.com";

export const searchRecipesByIngredients = async (ingredients: string[]) => {
  const ingredientString = ingredients.join(",");

  const { data } = await axios.get(
    `${API_BASE}/recipes/findByIngredients`,
    {
      params: {
        ingredients: ingredientString,
        number: 10,
        ranking: 1,
        apiKey: process.env.SPOONACULAR_API_KEY,
      },
    }
  );
  return data;
};