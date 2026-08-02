/**
 * Ingredient service layer — backed by localStorage.
 * Mirrors the shape/conventions of recipeService.js so both modules feel
 * consistent and are equally easy to point at a real API later.
 */

import { generateId } from "../utils/id";
import { logActivity } from "./activityService";

const INGREDIENTS_KEY = "cookcraft_ingredients";

function readAll() {
  try {
    const raw = localStorage.getItem(INGREDIENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeAll(ingredients) {
  localStorage.setItem(INGREDIENTS_KEY, JSON.stringify(ingredients));
}

function simulateLatency() {
  return new Promise((resolve) => setTimeout(resolve, 200));
}

export async function getIngredients() {
  await simulateLatency();
  return readAll().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function getIngredientById(id) {
  await simulateLatency();
  return readAll().find((i) => i.id === id) || null;
}

export async function createIngredient(ingredient) {
  const name = ingredient?.name?.trim();
  if (!name) {
    throw new Error("Ingredient name is required.");
  }
  if (!ingredient?.category) {
    throw new Error("Ingredient category is required.");
  }

  await simulateLatency();
  const ingredients = readAll();
  const duplicate = ingredients.some((i) => i.name.trim().toLowerCase() === name.toLowerCase());
  if (duplicate) {
    throw new Error(`"${name}" already exists in your ingredient list.`);
  }

  const now = new Date().toISOString();
  const newIngredient = {
    id: generateId("ingredient"),
    name,
    category: ingredient.category,
    quantity: ingredient.quantity ?? "",
    unit: ingredient.unit || "pcs",
    notes: ingredient.notes || "",
    createdAt: now,
    updatedAt: now,
  };
  writeAll([newIngredient, ...ingredients]);
  logActivity({ type: "ingredient", action: "create", message: `Added new ingredient "${newIngredient.name}"` });
  return newIngredient;
}

export async function updateIngredient(id, updates) {
  await simulateLatency();
  const ingredients = readAll();
  const index = ingredients.findIndex((i) => i.id === id);
  if (index === -1) {
    throw new Error("Ingredient not found. It may have already been deleted.");
  }

  if (updates.name) {
    const name = updates.name.trim();
    const duplicate = ingredients.some(
      (i) => i.id !== id && i.name.trim().toLowerCase() === name.toLowerCase()
    );
    if (duplicate) {
      throw new Error(`"${name}" already exists in your ingredient list.`);
    }
  }

  const updated = { ...ingredients[index], ...updates, id, updatedAt: new Date().toISOString() };
  ingredients[index] = updated;
  writeAll(ingredients);
  logActivity({ type: "ingredient", action: "update", message: `Updated ingredient "${updated.name}"` });
  return updated;
}

export async function deleteIngredient(id) {
  await simulateLatency();
  const ingredients = readAll();
  const target = ingredients.find((i) => i.id === id);
  if (!target) {
    throw new Error("Ingredient not found. It may have already been deleted.");
  }
  writeAll(ingredients.filter((i) => i.id !== id));
  logActivity({ type: "ingredient", action: "delete", message: `Deleted ingredient "${target.name}"` });
  return true;
}
