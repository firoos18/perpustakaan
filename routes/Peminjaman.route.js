const express = require("express");
const router = express.Router();
const { verifyAccessToken } = require("../helpers/jwt_helper");
const PeminjamanController = require("../controllers/Peminjaman.controller");

router.get("/", verifyAccessToken, PeminjamanController.getAllPeminjaman);

router.get("/:id", verifyAccessToken, PeminjamanController.getPeminjamanById);

router.post("/", verifyAccessToken, PeminjamanController.pinjamBuku);

router.patch("/:id", verifyAccessToken, PeminjamanController.editPeminjaman);

router.delete("/:id", verifyAccessToken, PeminjamanController.deletePeminjaman);

module.exports = router;
