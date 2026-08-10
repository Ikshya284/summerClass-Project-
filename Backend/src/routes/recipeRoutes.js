const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const { upload, handleUploadError } = require("../middleware/upload");
const recipeController = require("../controllers/recipeController");

router.use(verifyToken);

router.get("/", recipeController.list);
router.get("/:id", recipeController.getById);
router.post("/", upload.single("image"), handleUploadError, recipeController.create);
router.put("/:id", upload.single("image"), handleUploadError, recipeController.update);
router.delete("/:id", recipeController.remove);

module.exports = router;
