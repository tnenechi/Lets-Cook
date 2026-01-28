import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import api from "../api/client";
import toast from "react-hot-toast";
import { FaHeart } from "react-icons/fa";

gsap.registerPlugin(useGSAP, ScrollTrigger);

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
  }, [ingredients]);

  const handleDeleteRecipe = async (recipeId: number | string) => {
    try {
      const response = await api.delete(`/recipes/saved/${recipeId}`);
      toast.success("Recipe deleted successfully");
    } catch (error) {
      toast.error("Something went wrong. Please try again");
      console.error("Delete recipe failed", error);
    }
  };

  return (
    <div className="px-9 pb-10">
      {recipes ? (
        <div className="py-4">
          <h2>Recipes for you...</h2>
        </div>
      ) : (
        <div className="text-lg font-semibold leading-tight tracking-wide h-[70vh] flex justify-center items-center">
          You haven't saved any recipes <br /> Enter your ingredients to find
          recipes for you. 😊
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
                <div
                  onClick={() => handleDeleteRecipe(recipe.id)}
                  className="w-9 h-9 bg-gray-400/50 rounded-full flex items-center justify-center"
                >
                  <FaHeart
                    title="Unsave recipe."
                    className="text-red-600 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 flex flex-col gap-2 flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg leading-tight text-gray-800">
                  {recipe.title}
                </h3>
                <span
                  className="text-sm text-gray-800 h-9 w-9 rounded-full bg-gray-300 p-1 flex justify-center items-center"
                  title={`Ready in ${recipe.readyInMinutes} minutes.`}
                >
                  {recipe.readyInMinutes}
                </span>
              </div>

              <p className="text-sm text-gray-600 line-clamp-3">
                {recipe.summary}
              </p>

              <div className="mt-auto flex items-center justify-between">
                <a
                  href={recipe.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-800 btn btn-info"
                >
                  View Recipe
                </a>

                <div className="flex items-center gap-1">
                  {recipe.glutenFree && (
                    <span
                      className="text-sm rounded-full bg-gray-200 p-1 flex justify-center items-center"
                      title="Gluten Free"
                    >
                      🌾
                    </span>
                  )}
                  {recipe.vegan && (
                    <span
                      className="text-sm rounded-full bg-gray-200 p-1 flex justify-center items-center"
                      title="Vegan"
                    >
                      🌱
                    </span>
                  )}
                  {recipe.vegetarian && (
                    <span
                      className="text-sm rounded-full bg-gray-200 p-1 flex justify-center items-center"
                      title="Vegetarian"
                    >
                      🥕
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
