const express = require("express");
const router = express.Router();

const {
  register,
  login,
  googleAuth,
  me,
  getStats,
  deleteUser
} = require("../controllers/authController");

const { verifyToken, requireAdmin } = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleAuth);
router.get("/me", verifyToken, me);
router.get("/stats", verifyToken, requireAdmin, getStats);

// DELETE USER
router.delete("/user/:email", deleteUser);

module.exports = router;