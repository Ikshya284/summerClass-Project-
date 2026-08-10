const RECIPE_DIFFICULTIES = ["Easy", "Medium", "Hard"];

function isBlank(value) {
  return value === undefined || value === null || String(value).trim() === "";
}

function parseIngredients(raw) {
  if (!raw) return [];
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
  return Array.isArray(raw) ? raw : null;
}

function parseInstructions(raw) {
  if (!raw) return [];
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
  return Array.isArray(raw) ? raw : null;
}

function validateRegister({ name, email, password }) {
  const errors = [];
  if (isBlank(name)) errors.push("Name is required.");
  if (isBlank(email)) errors.push("Email is required.");
  if (isBlank(password)) errors.push("Password is required.");
  else if (String(password).length < 6) errors.push("Password must be at least 6 characters.");
  return errors;
}

function validateIngredientBody({ name, unit }) {
  const errors = [];
  if (isBlank(name)) errors.push("Ingredient name is required.");
  if (isBlank(unit)) errors.push("Unit of measurement is required.");
  return errors;
}

function validateRecipeBody(body, { requireImage = false, hasImage = false } = {}) {
  const errors = [];
  const { title, description, category, cookingTime, difficulty } = body;

  if (isBlank(title)) errors.push("Recipe name is required.");
  if (isBlank(description)) errors.push("Description is required.");
  if (isBlank(category)) errors.push("Category is required.");
  if (isBlank(cookingTime)) errors.push("Cooking time is required.");
  if (isBlank(difficulty)) errors.push("Difficulty is required.");
  else if (!RECIPE_DIFFICULTIES.includes(difficulty)) {
    errors.push(`Difficulty must be one of: ${RECIPE_DIFFICULTIES.join(", ")}.`);
  }

  if (requireImage && !hasImage) {
    errors.push("Recipe image is required.");
  }

  const ingredients = parseIngredients(body.ingredients);
  if (ingredients === null) {
    errors.push("Ingredients must be a valid JSON array.");
  } else if (ingredients.length === 0) {
    errors.push("At least one ingredient is required.");
  } else {
    ingredients.forEach((ing, i) => {
      if (!ing.ingredientId && !ing.id) {
        errors.push(`Ingredient ${i + 1}: select an ingredient from the list.`);
      }
      const qty = Number(ing.quantity);
      if (ing.quantity === "" || ing.quantity === null || ing.quantity === undefined) {
        errors.push(`Ingredient ${i + 1}: quantity is required.`);
      } else if (Number.isNaN(qty) || qty < 0) {
        errors.push(`Ingredient ${i + 1}: quantity must be a non-negative number.`);
      }
    });
  }

  const instructions = parseInstructions(body.instructions);
  if (instructions === null) {
    errors.push("Instructions must be a valid JSON array.");
  } else if (instructions.length === 0) {
    errors.push("At least one instruction step is required.");
  } else {
    instructions.forEach((step, i) => {
      if (isBlank(step.description)) {
        errors.push(`Instruction step ${i + 1}: description is required.`);
      }
    });
  }

  return errors;
}

module.exports = {
  isBlank,
  parseIngredients,
  parseInstructions,
  validateRegister,
  validateIngredientBody,
  validateRecipeBody,
  RECIPE_DIFFICULTIES,
};
