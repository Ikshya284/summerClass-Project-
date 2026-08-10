const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const User = require("../models/User");
const Recipe = require("../models/Recipe");
const { JWT_SECRET } = require("../middleware/auth");
const { validateRegister } = require("../utils/validation");

const TOKEN_EXPIRY = "7d";

function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

function signToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );
}

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const errors = validateRegister({ name, email, password });
    if (errors.length) {
      return res.status(400).json({ message: errors.join(" ") });
    }

    const existing = await User.findOne({ where: { email: email.trim().toLowerCase() } });
    if (existing) {
      return res.status(400).json({ message: "An account with this email already exists." });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashed,
      role: "user",
    });

    const sessionUser = sanitizeUser(user);
    const token = signToken(user);

    res.status(201).json({
      message: "User registered successfully",
      user: sessionUser,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ where: { email: email.trim().toLowerCase() } });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const sessionUser = sanitizeUser(user);
    const token = signToken(user);

    res.json({
      message: "Login successful",
      user: sessionUser,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/** Google sign-in: find or create user, return JWT (same session shape as email login). */
exports.googleAuth = async (req, res) => {
  try {
    const { email, name } = req.body;
    if (!email || !name) {
      return res.status(400).json({ message: "Email and name are required for Google sign-in." });
    }

    const normalizedEmail = email.trim().toLowerCase();
    let user = await User.findOne({ where: { email: normalizedEmail } });

    if (!user) {
      const randomPassword = await bcrypt.hash(`google-${Date.now()}-${Math.random()}`, 10);
      user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        password: randomPassword,
        role: "user",
      });
    }

    const sessionUser = sanitizeUser(user);
    const token = signToken(user);

    res.json({
      message: "Google sign-in successful",
      user: sessionUser,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.me = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "name", "email", "role"],
    });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const [totalRecipes, totalUsers] = await Promise.all([
      Recipe.count(),
      User.count(),
    ]);

    res.json({
      totalRecipes,
      totalUsers,
      averageRating: 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { email } = req.params;

    const normalizedEmail = email.trim().toLowerCase();

    const deleted = await User.destroy({
      where: {
        email: normalizedEmail,
      },
    });

    if (deleted === 0) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    res.status(200).json({
      message: "User deleted successfully.",
    });
  } catch (error) {
    console.error("Delete user error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};