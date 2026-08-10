const { Op } = require("sequelize");
const Ingredient = require("../models/Ingredient");
const { validateIngredientBody } = require("../utils/validation");

exports.list = async (req, res) => {
  try {
    const { search } = req.query;
    const where = {};

    if (search && search.trim()) {
      where.name = { [Op.like]: `%${search.trim()}%` };
    }

    const ingredients = await Ingredient.findAll({
      where,
      order: [["createdAt", "DESC"]],
    });

    res.json(ingredients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const ingredient = await Ingredient.findByPk(req.params.id);
    if (!ingredient) {
      return res.status(404).json({ message: "Ingredient not found." });
    }
    res.json(ingredient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, unit } = req.body;
    const errors = validateIngredientBody({ name, unit });
    if (errors.length) {
      return res.status(400).json({ message: errors.join(" ") });
    }

    const trimmedName = name.trim();
    const duplicate = await Ingredient.findOne({
      where: { name: { [Op.like]: trimmedName } },
    });
    if (duplicate) {
      return res.status(400).json({ message: `"${trimmedName}" already exists.` });
    }

    const ingredient = await Ingredient.create({
      name: trimmedName,
      unit: unit.trim(),
    });

    res.status(201).json(ingredient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const ingredient = await Ingredient.findByPk(req.params.id);
    if (!ingredient) {
      return res.status(404).json({ message: "Ingredient not found." });
    }

    const { name, unit } = req.body;
    const errors = validateIngredientBody({ name, unit });
    if (errors.length) {
      return res.status(400).json({ message: errors.join(" ") });
    }

    const trimmedName = name.trim();
    const duplicate = await Ingredient.findOne({
      where: {
        name: { [Op.like]: trimmedName },
        id: { [Op.ne]: ingredient.id },
      },
    });
    if (duplicate) {
      return res.status(400).json({ message: `"${trimmedName}" already exists.` });
    }

    await ingredient.update({ name: trimmedName, unit: unit.trim() });
    res.json(ingredient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const ingredient = await Ingredient.findByPk(req.params.id);
    if (!ingredient) {
      return res.status(404).json({ message: "Ingredient not found." });
    }
    await ingredient.destroy();
    res.json({ message: "Ingredient deleted." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
