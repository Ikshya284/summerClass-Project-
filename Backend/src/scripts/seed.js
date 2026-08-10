/**
 * Seed demo admin user and sample ingredients.
 * Run: node src/scripts/seed.js
 */
require("dotenv").config();
const bcrypt = require("bcrypt");
const sequelize = require("../config/database");
require("../models/index");
const User = require("../models/User");
const Ingredient = require("../models/Ingredient");

async function seed() {
  await sequelize.sync();

  const adminEmail = "admin@cookcraft.com";
  let admin = await User.findOne({ where: { email: adminEmail } });
  if (!admin) {
    admin = await User.create({
      name: "Chef Admin",
      email: adminEmail,
      password: await bcrypt.hash("admin123", 10),
      role: "admin",
    });
    console.log("Created admin user: admin@cookcraft.com / admin123");
  } else {
    console.log("Admin user already exists");
  }

  const sampleIngredients = [
    { name: "Tomato", unit: "pcs" },
    { name: "Olive Oil", unit: "tbsp" },
    { name: "Garlic", unit: "pcs" },
    { name: "Basil", unit: "g" },
    { name: "Pasta", unit: "g" },
  ];

  for (const ing of sampleIngredients) {
    const exists = await Ingredient.findOne({ where: { name: ing.name } });
    if (!exists) {
      await Ingredient.create(ing);
      console.log(`Created ingredient: ${ing.name}`);
    }
  }

  console.log("Seed complete.");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
