const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
require("dotenv").config();
const path = require("path");
const sharp = require("sharp");

const mongoURI = process.env.DB_URI;

const storage = new GridFsStorage({
  url: mongoURI + process.env.DB_NAME,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    return {
      bucketName: "uploads",
      filename: `${Date.now()}-${file.originalname}`,
    };
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
      return cb(new Error("Only Image Allowed"));
    }
    cb(null, true);
  },
});

console.log(upload);

module.exports = {
  upload: upload.single("file"),
};
