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

/**
 * CORS allowlist.
 *
 * FRONTEND_URL can hold one or more comma-separated origins, e.g.
 *   FRONTEND_URL=https://cookcraft-frontend.onrender.com,http://localhost:5173
 *
 * Requests with no Origin header (curl, server-to-server, Postman) are
 * always allowed. We don't use cookies for auth (JWT is sent via the
 * Authorization header), so `credentials: true` is not needed here —
 * keeping it off means the browser will never block a request for
 * missing credentialed-CORS headers.
 */
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
  })
);
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