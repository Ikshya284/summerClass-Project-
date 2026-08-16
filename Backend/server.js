require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const sequelize = require("./src/config/database");
require("./src/models/index");

const authRoutes = require("./src/routes/authRoutes");
const recipeRoutes = require("./src/routes/recipeRoutes");
const ingredientRoutes = require("./src/routes/ingredientRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/ingredients", ingredientRoutes);

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database connected and synced");
  })
  .catch((err) => {
    console.error("Database sync failed:", err);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
