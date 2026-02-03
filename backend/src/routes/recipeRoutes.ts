import express from "express";
import {
  deleteSavedRecipe,
  getSavedRecipes,
  saveRecipe,
  searchRecipes,
} from "../controllers/recipeController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/search", searchRecipes);
router.post("/save", authenticateUser, saveRecipe);
router.get("/saved", authenticateUser, getSavedRecipes);
router.delete("/saved/:recipeId", authenticateUser, deleteSavedRecipe);
// router.get("/saved/:id", authenticateUser, getSavedRecipeById);

export default router;
