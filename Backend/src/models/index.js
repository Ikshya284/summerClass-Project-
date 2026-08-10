const User = require("./User");
const Recipe = require("./Recipe");
const Ingredient = require("./Ingredient");
const RecipeIngredient = require("./RecipeIngredient");

Recipe.belongsToMany(Ingredient, {
  through: RecipeIngredient,
  foreignKey: "recipeId",
  otherKey: "ingredientId",
  as: "ingredients",
});

Ingredient.belongsToMany(Recipe, {
  through: RecipeIngredient,
  foreignKey: "ingredientId",
  otherKey: "recipeId",
  as: "recipes",
});

Recipe.belongsTo(User, { foreignKey: "createdBy", as: "author" });

module.exports = { User, Recipe, Ingredient, RecipeIngredient };
