import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import api from "../api/client";
import toast from "react-hot-toast";

const RecipeList = () => {
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

  const recipes: Recipe[] = [
    {
      id: 1,
      title: "Avocado Toast with Poached Egg",
      image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141",
      readyInMinutes: 10,
      sourceUrl: "https://example.com/avocado-toast",
      summary:
        "Creamy avocado spread over toasted sourdough topped with a perfectly poached egg.",
      glutenFree: false,
      vegan: false,
      vegetarian: true,
    },
    {
      id: 2,
      title: "Vegan Buddha Bowl",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
      readyInMinutes: 25,
      sourceUrl: "https://example.com/buddha-bowl",
      summary:
        "A nourishing bowl of quinoa, roasted vegetables, chickpeas, and tahini dressing.",
      glutenFree: true,
      vegan: true,
      vegetarian: true,
    },
    {
      id: 3,
      title: "Margherita Pizza",
      image: "https://images.unsplash.com/photo-1601924582975-7e1b3c4f2b9c",
      readyInMinutes: 30,
      sourceUrl: "https://example.com/margherita-pizza",
      summary:
        "Classic Italian pizza with tomato sauce, fresh mozzarella, and basil leaves.",
      glutenFree: false,
      vegan: false,
      vegetarian: true,
    },
    {
      id: 4,
      title: "Grilled Salmon with Lemon",
      image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2",
      readyInMinutes: 20,
      sourceUrl: "https://example.com/grilled-salmon",
      summary:
        "Tender grilled salmon fillet served with fresh lemon and herbs.",
      glutenFree: true,
      vegan: false,
      vegetarian: false,
    },
    {
      id: 5,
      title: "Gluten-Free Pancakes",
      image: "https://images.unsplash.com/photo-1587731342377-7a5b8f64c6c0",
      readyInMinutes: 15,
      sourceUrl: "https://example.com/gluten-free-pancakes",
      summary:
        "Fluffy gluten-free pancakes served with maple syrup and fresh berries.",
      glutenFree: true,
      vegan: false,
      vegetarian: true,
    },
    {
      id: 6,
      title: "Spaghetti Aglio e Olio",
      image: "https://images.unsplash.com/photo-1521389508051-d7ffb5dc8c89",
      readyInMinutes: 20,
      sourceUrl: "https://example.com/aglio-e-olio",
      summary:
        "Simple Italian pasta with garlic, olive oil, chili flakes, and parsley.",
      glutenFree: false,
      vegan: true,
      vegetarian: true,
    },
  ];

  // const [recipes, setRecipes] = useState<Recipe[]>([]);

  const [searchParams] = useSearchParams();
  const ingredients = searchParams.get("ingredients") || "";

  const [saved, setSaved] = useState<number[]>([]);

  // *** DATA FETCH ***
  // useEffect(() => {
  //   if (!ingredients) return;

  //   const handleSearch = async () => {
  //     try {
  //       const { data } = await api.get("/recipes/search", {
  //         params: { ingredients },
  //       });

  //       console.log("Returned from /recipes/search", data);
  //       setRecipes(data.data);
  //     } catch (error) {
  //       toast.error("Something went wrong. Please try again");
  //       console.error("Search failed", error);
  //     }
  //   };

  //   return () => {
  //     saved.forEach(async (recipeId) => {
  //       const recipe = recipes.find((r) => r.id === recipeId);
  //       if (recipe) await handleSaveRecipe(recipe);
  //     });
  //   };
  // }, [ingredients]);

  const handleClick = (recipeId: number) => {
    if (saved.includes(recipeId)) {
      setSaved((prev) => prev.filter((id) => id !== recipeId));
    } else {
      setSaved((prev) => [...prev, recipeId]);
    }
  };

  const handleSaveRecipe = async (recipe: Recipe) => {
    try {
      const response = await api.post("/recipes/saved", {
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
      toast.success("Recipe saved successfully");
    } catch (error) {
      toast.error("Something went wrong. Please try again");
      console.error("Search failed", error);
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
                {recipe.summary}
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

export default RecipeList;
