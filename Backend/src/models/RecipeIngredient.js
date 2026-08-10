const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const RecipeIngredient = sequelize.define(
  "RecipeIngredient",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    recipeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ingredientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = RecipeIngredient;
