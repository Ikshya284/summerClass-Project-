import api from "./api";
import { logActivity } from "./activityService";

export async function getIngredients({ search = "" } = {}) {
  const params = {};
  if (search.trim()) params.search = search.trim();
  const { data } = await api.get("/ingredients", { params });
  return data;
}

export async function getIngredientById(id) {
  const { data } = await api.get(`/ingredients/${id}`);
  return data;
}

export async function createIngredient(ingredient) {
  const { data } = await api.post("/ingredients", {
    name: ingredient.name,
    unit: ingredient.unit,
  });
  logActivity({
    type: "ingredient",
    action: "create",
    message: `Added new ingredient "${data.name}"`,
  });
  return data;
}

export async function updateIngredient(id, updates) {
  const { data } = await api.put(`/ingredients/${id}`, {
    name: updates.name,
    unit: updates.unit,
  });
  logActivity({
    type: "ingredient",
    action: "update",
    message: `Updated ingredient "${data.name}"`,
  });
  return data;
}

export async function deleteIngredient(id) {
  const existing = await getIngredientById(id).catch(() => null);
  await api.delete(`/ingredients/${id}`);
  if (existing) {
    logActivity({
      type: "ingredient",
      action: "delete",
      message: `Deleted ingredient "${existing.name}"`,
    });
  }
  return true;
}
