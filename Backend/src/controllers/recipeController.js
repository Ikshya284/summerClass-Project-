const fs = require("fs");
const path = require("path");
const { Op } = require("sequelize");
const Recipe = require("../models/Recipe");
const Ingredient = require("../models/Ingredient");
const RecipeIngredient = require("../models/RecipeIngredient");
const {
  parseIngredients,
  parseInstructions,
  validateRecipeBody,
  RECIPE_DIFFICULTIES,
} = require("../utils/validation");

const UPLOADS_DIR = path.join(__dirname, "../../uploads");

function formatRecipe(recipe) {
  const plain = recipe.toJSON ? recipe.toJSON() : recipe;
  const baseUrl = process.env.API_BASE_URL || "http://localhost:5000";
  const imageUrl = plain.imageUrl
    ? plain.imageUrl.startsWith("http")
      ? plain.imageUrl
      : `${baseUrl}${plain.imageUrl}`
    : null;

  const ingredients = (plain.ingredients || []).map((ing) => ({
    ingredientId: ing.id,
    id: ing.id,
    name: ing.name,
    unit: ing.unit,
    quantity: ing.RecipeIngredient?.quantity ?? ing.quantity,
  }));

  return {
    id: plain.id,
    title: plain.title,
    description: plain.description,
    cuisine: plain.cuisine,
    category: plain.category,
    cookingTime: plain.cookingTime,
    difficulty: plain.difficulty,
    imageUrl,
    images: imageUrl ? [{ id: "main", url: imageUrl, name: "recipe-image" }] : [],
    instructions: plain.instructions || [],
    ingredients,
    isPublished: plain.isPublished !== false,
    createdBy: plain.createdBy,
    createdAt: plain.createdAt,
    updatedAt: plain.updatedAt,
  };
}

async function syncRecipeIngredients(recipeId, ingredientsList) {
  await RecipeIngredient.destroy({ where: { recipeId } });

  for (const ing of ingredientsList) {
    const ingredientId = ing.ingredientId || ing.id;
    await RecipeIngredient.create({
      recipeId,
      ingredientId,
      quantity: Number(ing.quantity),
    });
  }
}

function deleteImageFile(imageUrl) {
  if (!imageUrl || !imageUrl.startsWith("/uploads/")) return;
  const filePath = path.join(__dirname, "../..", imageUrl);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

exports.list = async (req, res) => {
  try {
    const { search, difficulty, category } = req.query;
    const where = {};

    if (search && search.trim()) {
      where.title = { [Op.like]: `%${search.trim()}%` };
    }
    if (difficulty && difficulty !== "All" && RECIPE_DIFFICULTIES.includes(difficulty)) {
      where.difficulty = difficulty;
    }
    if (category && category !== "All") {
      where.category = category;
    }

    const recipes = await Recipe.findAll({
      where,
      include: [
        {
          model: Ingredient,
          as: "ingredients",
          through: { attributes: ["quantity"] },
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(recipes.map(formatRecipe));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const recipe = await Recipe.findByPk(req.params.id, {
      include: [
        {
          model: Ingredient,
          as: "ingredients",
          through: { attributes: ["quantity"] },
        },
      ],
    });

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found." });
    }

    res.json(formatRecipe(recipe));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const errors = validateRecipeBody(req.body, {
      requireImage: true,
      hasImage: Boolean(req.file),
    });
    if (errors.length) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: errors.join(" ") });
    }

    const ingredientsList = parseIngredients(req.body.ingredients);
    const instructions = parseInstructions(req.body.instructions);

    const ingredientIds = ingredientsList.map((i) => i.ingredientId || i.id);
    const found = await Ingredient.findAll({ where: { id: ingredientIds } });
    if (found.length !== ingredientIds.length) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: "One or more selected ingredients do not exist." });
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const recipe = await Recipe.create({
      title: req.body.title.trim(),
      description: req.body.description.trim(),
      cuisine: req.body.cuisine?.trim() || null,
      category: req.body.category.trim(),
      cookingTime: req.body.cookingTime.trim(),
      difficulty: req.body.difficulty.trim(),
      imageUrl,
      instructions,
      isPublished: req.body.isPublished !== undefined ? req.body.isPublished === true || req.body.isPublished === "true" : true,
      createdBy: req.user.id,
    });

    await syncRecipeIngredients(recipe.id, ingredientsList);

    const full = await Recipe.findByPk(recipe.id, {
      include: [
        {
          model: Ingredient,
          as: "ingredients",
          through: { attributes: ["quantity"] },
        },
      ],
    });

    res.status(201).json(formatRecipe(full));
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const recipe = await Recipe.findByPk(req.params.id);
    if (!recipe) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: "Recipe not found." });
    }

    const errors = validateRecipeBody(req.body, {
      requireImage: false,
      hasImage: Boolean(req.file) || Boolean(recipe.imageUrl),
    });
    if (errors.length) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: errors.join(" ") });
    }

    const ingredientsList = parseIngredients(req.body.ingredients);
    const instructions = parseInstructions(req.body.instructions);

    const ingredientIds = ingredientsList.map((i) => i.ingredientId || i.id);
    const found = await Ingredient.findAll({ where: { id: ingredientIds } });
    if (found.length !== ingredientIds.length) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: "One or more selected ingredients do not exist." });
    }

    let imageUrl = recipe.imageUrl;
    if (req.file) {
      deleteImageFile(recipe.imageUrl);
      imageUrl = `/uploads/${req.file.filename}`;
    }

    await recipe.update({
      title: req.body.title.trim(),
      description: req.body.description.trim(),
      cuisine: req.body.cuisine?.trim() || null,
      category: req.body.category.trim(),
      cookingTime: req.body.cookingTime.trim(),
      difficulty: req.body.difficulty.trim(),
      imageUrl,
      instructions,
      isPublished: req.body.isPublished !== undefined ? req.body.isPublished === true || req.body.isPublished === "true" : recipe.isPublished,
    });

    await syncRecipeIngredients(recipe.id, ingredientsList);

    const full = await Recipe.findByPk(recipe.id, {
      include: [
        {
          model: Ingredient,
          as: "ingredients",
          through: { attributes: ["quantity"] },
        },
      ],
    });

    res.json(formatRecipe(full));
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ message: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const recipe = await Recipe.findByPk(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found." });
    }

    deleteImageFile(recipe.imageUrl);
    await RecipeIngredient.destroy({ where: { recipeId: recipe.id } });
    await recipe.destroy();

    res.json({ message: "Recipe deleted." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
