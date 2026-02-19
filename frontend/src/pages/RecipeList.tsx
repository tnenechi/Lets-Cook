import { useEffect, useState } from "react";
import { redirect, useSearchParams } from "react-router";
import api from "../api/client";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const RecipeList = () => {
  const { user } = useAuth();

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

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [quotaExceeded, setQuotaExceeded] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [loading, setLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const ingredients = searchParams.get("ingredients") || "";

  const [saved, setSaved] = useState<number[]>([]);

  // *** DATA FETCH ***
  useEffect(() => {
    if (!ingredients) return;

    // Get the recipes or setTimeRemaining if quota is exceeded
    const getRecipes = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/recipes/search", {
          params: { ingredients },
        });
        setRecipes(data.data.recipesInfo);
      } catch (error: any) {
        if (error.response.status === 402) {
          setQuotaExceeded(true);
          setTimeRemaining(Math.floor(error.response.data.data / 1000));
          return;
        }
        toast.error("Something went wrong.");
        console.error("Search failed", error);
        redirect("/");
      } finally {
        setLoading(false);
      }
    };

    getRecipes();
  }, [ingredients]);

  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setQuotaExceeded(false);
    }
  }, [timeRemaining]);

  // handle save/unsave recipe click
  const handleClick = async (recipeId: number) => {
    if (saved.includes(recipeId)) {
      setSaved((prev) => prev.filter((id) => id !== recipeId));
      await handleDeleteRecipe(recipeId);
      return;
    }

    setSaved((prev) => [...prev, recipeId]);

    const recipe = recipes.find((r) => r.id === recipeId);
    if (recipe) {
      await handleSaveRecipe(recipe);
    }
  };

  const handleSaveRecipe = async (recipe: Recipe) => {
    try {
      await api.post("/recipes/save", {
        id: recipe.id,
        title: recipe.title,
        imageUrl: recipe.image,
        readyInMinutes: recipe.readyInMinutes,
        sourceUrl: recipe.sourceUrl,
        summary: recipe.summary,
        glutenFree: recipe.glutenFree,
        vegan: recipe.vegan,
        vegetarian: recipe.vegetarian,
      });

      toast.success("Recipe saved");
      console.log("Recipe saved: ", recipe);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error("Please log in.");
        redirect("/login");
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  const handleDeleteRecipe = async (recipeId: number) => {
    try {
      console.log("ID TO BE DELETED ****: ", recipeId);
      await api.delete(`/recipes/saved/${recipeId}`);
      toast.success("Recipe unsaved");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error("Please log in.");
        redirect("/login");
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const parts = [];
    if (hours > 0) {
      parts.push(`${hours}`.padStart(2, "0"));
    }
    parts.push(`${minutes}`.padStart(2, "0"));
    parts.push(`${remainingSeconds}`.padStart(2, "0"));

    return parts.join(":");
  };

  return (
    <div className="px-x-xs sm:px-x-sm pb-20">
      {loading ? (
        <div className="h-[70vh] flex justify-center items-center">
          <h2>Loading recipes...</h2>
        </div>
      ) : quotaExceeded ? (
        <div className="h-[70vh] flex flex-col justify-center items-center">
          <h2 className="text-2xl font-bold">Daily limit reached</h2>
          <p className="mt-4">
            Hi. This site uses data from{" "}
            <a
              href="https://spoonacular.com/food-api"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-info"
            >
              Spoonacular API
            </a>{" "}
            and the daily access limit has been reached. You can try again in{" "}
            <span className="p-2 bg-primary text-primary-content rounded-2xl">
              {formatTime(timeRemaining)}
            </span>
          </p>
        </div>
      ) : recipes.length === 0 ? (
        <div className="h-[70vh] flex justify-center items-center">
          <h2>Enter your ingredients to find recipes for you. 😊</h2>
        </div>
      ) : (
        <>
          <div className="p-4 mb-12 flex w-full justify-between shadow-md">
            <p>Recipes for you...</p>
            {!user && (
              <div
                className="tooltip tooltip-open tooltip-left"
                data-tip="Log in to save recipes"
              >
                <div className="w-8 h-8">
                  <img src="/images/profile.png" alt="" />
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-6 md:gap-3 justify-center md:justify-start">
            {recipes.map((recipe) => (
              <div
                key={recipe.id}
                className="w-full sm:w-[280px] bg-base-300 text-base-content rounded-xl overflow-hidden shadow-md flex flex-col"
              >
                <div
                  className="h-44 bg-center bg-cover relative"
                  style={{ backgroundImage: `url(${recipe.image})` }}
                >
                  {user && (
                    <div className="p-4 absolute bottom-0 right-0 w-full flex justify-end">
                      <button
                        onClick={() => handleClick(recipe.id)}
                        className="btn btn-circle bg-neutral-content text-neutral"
                        title="Save recipe."
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill={saved.includes(recipe.id) ? "red" : "none"}
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
                  )}
                </div>

                <div className="p-4 flex flex-col gap-2 flex-1">
                  <div className="flex items-center justify-between">
                    <h3>{recipe.title}</h3>
                    <p
                      className="whitespace-nowrap text-xs text-info cursor-pointer"
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
                    <div className="flex items-center gap-4 cursor-pointer">
                      {recipe.glutenFree && (
                        <span
                          className="h-6 w-6 rounded-full bg-neutral-content shadow-sm p-1 flex justify-center items-center"
                          title="Gluten Free"
                        >
                          <img
                            src="/images/gluten-free.png"
                            alt="gluten-free"
                          />
                        </span>
                      )}
                      {recipe.vegan && (
                        <span
                          className="h-6 w-6 text-sm rounded-full bg-neutral-content shadow-sm p-1 flex justify-center items-center"
                          title="Vegan"
                        >
                          <img src="/images/vegan.png" alt="vegan" />
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
        </>
      )}
    </div>
  );
};

export default RecipeList;
