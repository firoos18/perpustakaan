const express = require("express");
const router = express.Router();
const { verifyAccessToken } = require("../helpers/jwt_helper");
const BukuController = require("../controllers/Buku.controller");
const { upload } = require("../middleware/upload");

router.get("/", verifyAccessToken, BukuController.getAllBuku);

router.get("/:id", verifyAccessToken, BukuController.getBukuById);

router.patch("/:id", verifyAccessToken, BukuController.editBuku);

router.patch(
  "/status/:id",
  verifyAccessToken,
  BukuController.updateKetersediaanBuku
);

router.post("/add", verifyAccessToken, upload, BukuController.uploadBuku);

router.get("/image-url/:id", verifyAccessToken, BukuController.getImage);

router.get("/image/:id", verifyAccessToken, BukuController.serveImage);

module.exports = router;
