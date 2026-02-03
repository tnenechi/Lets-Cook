import { useEffect, useState } from "react";
import api from "../api/client";
import toast from "react-hot-toast";

const MySavedRecipes = () => {
  type Recipe = {
    externalId: number;
    title: string;
    image: string;
    readyInMinutes: number;
    sourceUrl: string;
    summary: string;
    glutenFree: boolean;
    vegan: boolean;
    vegetarian: boolean;
  };

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [unsaved, setUnSaved] = useState<number[]>([]);

  // *** DATA FETCH ***
  useEffect(() => {
    const handleGetSaved = async () => {
      try {
        const { data } = await api.get("/recipes/saved");

        console.log("Returned from /recipes/saved", data.data.savedRecipes);

        const normalizedRecipes = data.data.savedRecipes.map((item: any) => ({
          externalId: item.recipe.externalId,
          title: item.recipe.title,
          image: item.recipe.imageUrl,
          readyInMinutes: item.recipe.readyInMinutes,
          sourceUrl: item.recipe.sourceUrl,
          summary: item.recipe.summary ?? "",
          glutenFree: item.recipe.glutenFree,
          vegan: item.recipe.vegan,
          vegetarian: item.recipe.vegetarian,
        }));

        setRecipes(normalizedRecipes);
      } catch (error) {
        toast.error("Something went wrong. Please try again");
        console.error("Search failed", error);
      }
    };

    handleGetSaved();
  }, []);

  const handleClick = async (recipeId: number) => {
    if (unsaved.includes(recipeId)) {
      setUnSaved((prev) => prev.filter((id) => id !== recipeId));

      const recipe = recipes.find((r) => r.externalId === recipeId);
      if (recipe) {
        await handleSaveRecipe(recipe);
      }
      return;
    }

    setUnSaved((prev) => [...prev, recipeId]);
    await handleDeleteRecipe(recipeId);
  };

  const handleSaveRecipe = async (recipe: Recipe) => {
    try {
      await api.post("/recipes/saved", {
        id: recipe.externalId,
        title: recipe.title,
        imageUrl: recipe.image,
        readyInMinutes: recipe.readyInMinutes,
        sourceUrl: recipe.sourceUrl,
        summary: recipe.summary,
        glutenFree: recipe.glutenFree,
        vegan: recipe.vegan,
        vegetarian: recipe.vegetarian,
      });

      console.log("Recipe saved: ", recipe);
      toast.success("Recipe saved");
    } catch (error) {
      toast.error("Something went wrong. Please try again");
      console.error("Search failed", error);
    }
  };

  const handleDeleteRecipe = async (recipeId: number) => {
    try {
      await api.delete(`/recipes/saved/${recipeId}`);
      toast.success("Recipe unsaved");
    } catch (error) {
      toast.error("Something went wrong. Please try again");
      console.error("Delete recipe failed", error);
    }
  };

  return (
    <div className="px-9 pb-20">
      {recipes.length > 0 ? (
        <div className="pt-4 pb-12 flex w-full justify-between">
          <p className="">Your saved recipes...</p>
        </div>
      ) : (
        <div className="h-[70vh] flex justify-center items-center">
          <h2> Enter your ingredients to find recipes for you. 😊</h2>
        </div>
      )}

      <div className="flex flex-wrap gap-6 md:gap-3 justify-center md:justify-start">
        {recipes?.map((recipe) => (
          <div
            key={recipe.externalId}
            className="w-full sm:w-[280px] bg-neutral text-neutral-content  rounded-xl overflow-hidden shadow-md flex flex-col"
          >
            <div
              className="h-44 bg-center bg-cover relative"
              style={{ backgroundImage: `url(${recipe.image})` }}
            >
              <div className="p-4 absolute bottom-0 right-0 w-full flex justify-end">
                <button
                  onClick={() => handleClick(recipe.externalId)}
                  className="btn btn-circle btn-neutral-content text-neutral"
                  title="Save recipe."
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill={unsaved.includes(recipe.externalId) ? "none" : "red"}
                    viewBox="0 0 24 24"
                    strokeWidth="2.5"
                    stroke="currentColor"
                    className="size-[1.2em]"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-4 flex flex-col gap-2 flex-1">
              <div className="flex items-center justify-between">
                <h3>{recipe.title}</h3>

                <p
                  className="whitespace-nowrap text-sm text-accent"
                  title={`Ready in ${recipe.readyInMinutes} minutes.`}
                >
                  {recipe.readyInMinutes + " min"}
                </p>
              </div>

              <p className="line-clamp-3">
                {recipe.summary.replace(/<[^>]+>/g, "")}
              </p>

              <div className="mt-auto flex items-center justify-between">
                <a
                  href={recipe.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  View Recipe
                </a>

                <div className="flex items-center gap-4 cursor-help">
                  {recipe.glutenFree && (
                    <span
                      className="h-6 w-6 rounded-full bg-neutral-content shadow-sm p-1 flex justify-center items-center"
                      title="Gluten Free"
                    >
                      <img src="/images/gluten-free.png" alt="gluten-free" />
                    </span>
                  )}
                  {recipe.vegan && (
                    <span
                      className="h-6 w-6 text-sm rounded-full bg-neutral-content shadow-sm p-1 flex justify-center items-center"
                      title="Vegan"
                    >
                      <img src="/images/vegan.png" alt="vegan" className="" />
                    </span>
                  )}
                  {recipe.vegetarian && (
                    <span
                      className="h-6 w-6 text-sm rounded-full bg-neutral-content shadow-sm p-1 flex justify-center items-center"
                      title="Vegetarian"
                    >
                      <img src="/images/vegetarian.png" alt="vegetarian" />
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MySavedRecipes;
