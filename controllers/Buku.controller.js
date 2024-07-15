const createError = require("http-errors");
const Buku = require("../models/Buku.model");
const { getGfs } = require("../helpers/init_mongodb");
const { addBukuSchema } = require("../helpers/validation_schema");

async function getAllBuku(req, res, next) {
  try {
    const { isAvailable } = req.query;

    let filter = {};
    if (isAvailable === 1) {
      filter = { status: "tersedia" };
    } else if (isAvailable === 0) {
      filter = { status: "dipinjam" };
    }

    const bukuList = await Buku.find(filter);

    const formattedBukuList = await Promise.all(
      bukuList.map(async (buku) => {
        let imageUrl = null;
        if (buku.imageId) {
          imageUrl = `${req.protocol}://${req.get("host")}/buku/image/${
            buku.imageId
          }`;
        }

        return {
          id: buku._id,
          judul: buku.judul,
          pengarang: buku.pengarang,
          sinopsis: buku.sinopsis,
          status: buku.status,
          imageUrl: imageUrl,
        };
      })
    );

    const response = {
      status: 200,
      message: "success",
      data: formattedBukuList,
    };

    res.send(response);
  } catch (error) {
    next(error);
  }
}

async function getBukuById(req, res, next) {
  try {
    const { id } = req.params;

    const buku = await Buku.findById(id);
    if (!buku)
      throw createError.NotFound(`Buku with Buku ID ${id} is Not Found`);

    const response = {
      status: 200,
      message: "success",
      data: buku,
    };

    res.send(response);
  } catch (error) {
    next(error);
  }
}

async function uploadBuku(req, res, next) {
  try {
    const result = await addBukuSchema.validateAsync(req.body);

    const newBuku = new Buku(result);
    await newBuku.save();

    const imageUrl = req.file
      ? `${req.protocol}://${req.get("host")}/buku/image/${savedBuku.id}`
      : null;
    savedBuku.toJSON = function () {
      return {
        id: this._id,
        judul: this.judul,
        pengarang: this.pengarang,
        sinopsis: this.sinopsis,
        status: this.status,
        imageUrl: imageUrl,
      };
    };

    const response = {
      status: 200,
      message: "Book with image uploaded successfully!",
      data: savedBuku.toJSON(),
    };

    res.send(response);
  } catch (error) {
    next(error);
  }
}

async function editBuku(req, res, next) {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const buku = await Buku.findByIdAndUpdate(
      id,
      { $set: updatedData },
      { returnOriginal: false }
    );
    if (!buku)
      throw createError.NotFound(`Buku with Buku ID ${id} is Not Found`);

    const response = {
      status: 200,
      message: "success",
      data: buku,
    };

    res.send(response);
  } catch (error) {
    next(error);
  }
}

async function updateKetersediaanBuku(req, res, next) {
  try {
    const { id } = req.params;

    const isExist = await Buku.findById(id);
    if (!isExist)
      throw createError.NotFound(`Buku with Buku ID ${id} is Not Found`);

    let newStatus;
    if (isExist.status === "tersedia") {
      newStatus = "dipinjam";
    } else {
      newStatus = "tersedia";
    }

    const buku = await Buku.findByIdAndUpdate(
      id,
      {
        $set: { status: newStatus },
      },
      { returnOriginal: false }
    );

    const response = {
      status: 200,
      message: "success",
      data: buku,
    };

    res.send(response);
  } catch (error) {
    next(error);
  }
}

async function getImage(req, res, next) {
  try {
    const { id } = req.params;
    const gfs = getGfs();

    const buku = await Buku.findById(id);

    if (!buku || !buku.imageId)
      throw createError.NotFound(`Buku with Buku ID ${id} is Not Found`);

    const file = await gfs.find({ _id: buku.imageId }).toArray();
    if (!file) throw createError.NotFound("Image not Found");

    const imageUrl = `${req.protocol}://${req.get("host")}/buku/image/${
      buku.id
    }`;

    const response = {
      status: 200,
      message: "success",
      data: imageUrl,
    };

    res.send(response);
  } catch (error) {
    next(error);
  }
}

async function serveImage(req, res, next) {
  try {
    const { id } = req.params;
    const gfs = getGfs();

    const buku = await Buku.findById(id);
    if (!buku)
      throw createError.NotFound(`Buku with Buku ID ${id} is Not Found`);

    const file = await gfs.find({ _id: buku.imageId }).toArray();
    if (!file || file.length === 0)
      throw createError.NotFound(`Image for Buku ${buku.judul} is Not Found`);

    const readStream = gfs.openDownloadStream(buku.imageId);
    res.set("Content-Type", file[0].contentType);
    readStream.pipe(res);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllBuku,
  getBukuById,
  uploadBuku,
  getImage,
  serveImage,
  editBuku,
  updateKetersediaanBuku,
};
