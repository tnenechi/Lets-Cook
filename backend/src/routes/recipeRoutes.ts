import express from "express";
import {
  deleteSavedRecipe,
  getSavedRecipeById,
  getSavedRecipes,
  saveRecipe,
  searchRecipes,
} from "../controllers/recipeController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/search", searchRecipes);
router.post("/save", authenticateUser, saveRecipe);
router.get("/saved", authenticateUser, getSavedRecipes);
router.get("/saved/:id", authenticateUser, getSavedRecipeById);
router.delete("/saved/:id", authenticateUser, deleteSavedRecipe);

export default router;
