import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import api from "../api/client";
import toast from "react-hot-toast";

const MySavedRecipes = () => {
  type Recipe = {
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

  const [recipes, setRecipes] = useState<Recipe[]>();
  const [unsaved, setUnSaved] = useState<number[]>([]);

  const [searchParams] = useSearchParams();
  const ingredients = searchParams.get("ingredients") || "";

  // *** DATA FETCH ***
  useEffect(() => {
    if (!ingredients) return;

    const handleGetSaved = async () => {
      try {
        const { data } = await api.get("/recipes/saved");

        console.log("Returned from /recipes/search", data);
        setRecipes(data.data);
      } catch (error) {
        toast.error("Something went wrong. Please try again");
        console.error("Search failed", error);
      }
    };

    handleGetSaved();

    return () => {
      // Delete recipes when component unmounts
      unsaved.forEach((unsavedId) => {
        handleDeleteRecipe(unsavedId);
      });
    };
  }, [ingredients]);

  const handleClick = (recipeId: number) => {
    if (unsaved.includes(recipeId)) {
      setUnSaved((prev) => prev.filter((id) => id !== recipeId));
    } else {
      setUnSaved((prev) => [...prev, recipeId]);
    }
  };

  const handleDeleteRecipe = async (recipeId: number) => {
    try {
      const response = await api.delete(`/recipes/saved/${recipeId}`);
      toast.success("Recipe deleted successfully");
    } catch (error) {
      toast.error("Something went wrong. Please try again");
      console.error("Delete recipe failed", error);
    }
  };

  return (
    <div className="px-9 pb-20">
      {recipes ? (
        <div className="py-4">
          <h2>Recipes you loved...</h2>
        </div>
      ) : (
        <div className="text-lg font-semibold leading-tight tracking-wide h-[70vh] flex justify-center items-center">
          Enter your ingredients to find recipes for you. 😊
        </div>
      )}

      <div className="flex flex-wrap gap-6 md:gap-3 justify-center md:justify-start">
        {recipes?.map((recipe) => (
          <div
            key={recipe.id}
            className="w-full sm:w-[280px] bg-white rounded-xl overflow-hidden shadow-md flex flex-col"
          >
            <div
              className="h-44 bg-center bg-cover relative"
              style={{ backgroundImage: `url(${recipe.image})` }}
            >
              <div className="p-4 absolute bottom-0 right-0 w-full flex justify-end">
                <button
                  onClick={() => handleClick(recipe.id)}
                  className="btn btn-circle"
                  title="Save recipe."
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill={unsaved.includes(recipe.id) ? "none" : "red"}
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
                <h3 className="font-semibold text-lg leading-tight text-gray-800">
                  {recipe.title}
                </h3>

                <p
                  className="text-sm whitespace-nowrap"
                  title={`Ready in ${recipe.readyInMinutes} minutes.`}
                >
                  {recipe.readyInMinutes + " min"}
                </p>
              </div>

              <p className="text-sm text-gray-600 line-clamp-3">
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

                <div className="flex items-center gap-1">
                  {recipe.glutenFree && (
                    <span
                      className="h-9 w-9 rounded-full bg-gray-200 p-1 flex justify-center items-center"
                      title="Gluten Free"
                    >
                      <img src="/images/gluten-free.png" alt="gluten-free" />
                    </span>
                  )}
                  {recipe.vegan && (
                    <span
                      className="h-9 w-9 text-sm rounded-full bg-gray-200 p-1 flex justify-center items-center"
                      title="Vegan"
                    >
                      <img src="/images/vegan.png" alt="vegan" className="" />
                    </span>
                  )}
                  {recipe.vegetarian && (
                    <span
                      className="h-9 w-9 text-sm rounded-full bg-gray-200 p-1 flex justify-center items-center"
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
