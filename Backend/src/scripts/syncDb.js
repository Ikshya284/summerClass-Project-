require("dotenv").config();
const sequelize = require("../config/database");
require("../models");

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database synced successfully");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Database sync failed:", err);
    process.exit(1);
  });
