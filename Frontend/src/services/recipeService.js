  /**
   * Recipe service layer.
   *
   * This is intentionally backend-agnostic: every function below returns a
   * Promise, just like a real network call would. Right now they only touch
   * local state / the console, but swapping the body of each function for a
   * `fetch(...)` (or your API client of choice) is all that's needed to wire
   * this up to a real backend later — no calling components need to change.
   *
   *   createRecipe -> POST   /api/recipes
   *   getRecipes   -> GET    /api/recipes
   *   updateRecipe -> PUT    /api/recipes/:id
   *   deleteRecipe -> DELETE /api/recipes/:id
   */

  export async function createRecipe(recipe) {
    // TODO: replace with `await fetch("/api/recipes", { method: "POST", body: JSON.stringify(recipe) })`
    console.log("[recipeService] createRecipe (local only):", recipe);
    return { ...recipe, id: `local-${Date.now()}` };
  }

  export async function getRecipes() {
    // TODO: replace with `await fetch("/api/recipes")`
    return [];
  }

  export async function updateRecipe(id, updates) {
    // TODO: replace with `await fetch(`/api/recipes/${id}`, { method: "PUT", body: JSON.stringify(updates) })`
    console.log("[recipeService] updateRecipe (local only):", id, updates);
    return { id, ...updates };
  }

  export async function deleteRecipe(id) {
    // TODO: replace with `await fetch(`/api/recipes/${id}`, { method: "DELETE" })`
    console.log("[recipeService] deleteRecipe (local only):", id);
    return true;
  }