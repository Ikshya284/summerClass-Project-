import api from "./api";
import { logActivity } from "./activityService";

export async function getRecipes({ search = "", difficulty = "All", category = "All" } = {}) {
  const params = {};
  if (search.trim()) params.search = search.trim();
  if (difficulty && difficulty !== "All") params.difficulty = difficulty;
  if (category && category !== "All") params.category = category;

  const { data } = await api.get("/recipes", { params });
  return data;
}

export async function getRecipeById(id) {
  const { data } = await api.get(`/recipes/${id}`);
  return data;
}

export async function createRecipe(recipe, imageFile) {
  const formData = buildRecipeFormData(recipe, imageFile);
  const { data } = await api.post("/recipes", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  logActivity({
    type: "recipe",
    action: "create",
    message: `Added new recipe "${data.title}"`,
  });
  return data;
}

export async function updateRecipe(id, recipe, imageFile) {
  const formData = buildRecipeFormData(recipe, imageFile);
  const { data } = await api.put(`/recipes/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  logActivity({
    type: "recipe",
    action: "update",
    message: `Updated recipe "${data.title}"`,
  });
  return data;
}

export async function deleteRecipe(id) {
  const existing = await getRecipeById(id).catch(() => null);
  await api.delete(`/recipes/${id}`);
  if (existing) {
    logActivity({
      type: "recipe",
      action: "delete",
      message: `Deleted recipe "${existing.title}"`,
    });
  }
  return true;
}

function buildRecipeFormData(recipe, imageFile) {
  const formData = new FormData();
  formData.append("title", recipe.title);
  formData.append("description", recipe.description);
  formData.append("cuisine", recipe.cuisine || "");
  formData.append("category", recipe.category);
  formData.append("cookingTime", recipe.cookingTime);
  formData.append("difficulty", recipe.difficulty);
  formData.append("isPublished", recipe.isPublished !== false ? "true" : "false");

  const ingredients = (recipe.ingredients || []).map((ing) => ({
    ingredientId: ing.ingredientId || ing.id,
    quantity: ing.quantity,
  }));
  formData.append("ingredients", JSON.stringify(ingredients));

  const instructions = (recipe.instructions || []).map((step) => ({
    description: step.description,
  }));
  formData.append("instructions", JSON.stringify(instructions));

  if (imageFile) {
    formData.append("image", imageFile);
  }

  return formData;
}
