import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Home from "./pages/Home.tsx";
import RecipeList from "./pages/RecipeList.tsx";
import LoginPage, { loginAction } from "./pages/LoginPage.tsx";
import RegisterPage, { registerAction } from "./pages/RegisterPage.tsx";
import { Toaster } from "react-hot-toast";
import App from "./App.tsx";
import MySavedRecipes from "./pages/MySavedRecipes.tsx";

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "/search", element: <RecipeList /> },
      {
        path: "/login",
        element: <LoginPage />,
        action: loginAction,
      },
      {
        path: "/register",
        element: <RegisterPage />,
        action: registerAction,
      },
      { path: "/my-recipes", element: <MySavedRecipes /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
    <Toaster />
  </StrictMode>,
);
