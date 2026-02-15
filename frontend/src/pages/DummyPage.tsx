import { useState } from "react";
import toast from "react-hot-toast";

const DummyPage = () => {
  const [saved, setSaved] = useState<number[]>([]);

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
      image: "https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg",
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
      image: "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg",
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
      image:
        "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg",
      readyInMinutes: 20,
      sourceUrl: "https://example.com/aglio-e-olio",
      summary:
        "Simple Italian pasta with garlic, olive oil, chili flakes, and parsley.",
      glutenFree: false,
      vegan: true,
      vegetarian: true,
    },
  ];

  // handle save/unsave recipe click
  const handleClick = async (recipeId: number) => {
    if (saved.includes(recipeId)) {
      setSaved((prev) => prev.filter((id) => id !== recipeId));
      return toast.success("Removed");
    }

    setSaved((prev) => [...prev, recipeId]);

    return toast.success("Saved!");
  };

  return (
    <div className="px-x-xs sm:px-x-sm pb-20">
      <div className="p-4 mb-12 flex w-full justify-between shadow-md">
        <p className="">Recipes for you...</p>
      </div>

      <div className="flex flex-wrap gap-6 md:gap-3 justify-center md:justify-start">
        {recipes?.map((recipe) => (
          <div
            key={recipe.id}
            className="w-full sm:w-[280px] bg-base-300 text-base-content  rounded-xl overflow-hidden shadow-md flex flex-col"
          >
            <div
              className="h-44 bg-center bg-cover relative"
              style={{ backgroundImage: `url(${recipe.image})` }}
            >
              <div className="p-4 absolute bottom-0 right-0 w-full flex justify-end">
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
              </div>
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

export default DummyPage;
