const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const ingredientController = require("../controllers/ingredientController");

router.use(verifyToken);

router.get("/", ingredientController.list);
router.get("/:id", ingredientController.getById);
router.post("/", ingredientController.create);
router.put("/:id", ingredientController.update);
router.delete("/:id", ingredientController.remove);

module.exports = router;
