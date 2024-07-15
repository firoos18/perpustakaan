const createError = require("http-errors");
const Peminjaman = require("../models/Peminjaman.model");
const Buku = require("../models/Buku.model");
const Mahasiswa = require("../models/Mahasiswa.model");
const { peminjamanSchema } = require("../helpers/validation_schema");

async function getAllPeminjaman(req, res, next) {
  try {
    const peminjaman = await Peminjaman.find()
      .populate("mahasiswaId")
      .populate({ path: "bukuId", select: "-__v" })
      .select("-__v");

    const populatedData = peminjaman.map((item) => {
      const buku = item.bukuId;
      const bukuImageUrl = buku.imageId
        ? `${req.protocol}://${req.get("host")}/buku/image/${buku.id}`
        : null;

      return {
        id: item._id,
        mahasiswa: {
          id: item.mahasiswaId._id,
          nama: item.mahasiswaId.nama,
          nim: item.mahasiswaId.nim,
          email: item.mahasiswaId.email,
        },
        buku: {
          judul: buku.judul,
          pengarang: buku.pengarang,
          sinopsis: buku.sinopsis,
          status: buku.status,
          bukuImageUrl,
        },
        tanggalPeminjaman: item.tanggalPeminjaman,
        tanggalKembali: item.tanggalKembali,
      };
    });

    const response = {
      status: 200,
      message: "success",
      data: populatedData,
    };

    res.send(response);
  } catch (error) {
    next(error);
  }
}

async function getPeminjamanById(req, res, next) {
  try {
    const { id } = req.params;

    const peminjaman = await Peminjaman.findById(id)
      .populate("mahasiswaId")
      .populate({
        path: "bukuId",
        select: "-__v",
      })
      .select("-__v");

    const buku = peminjaman.bukuId;
    const bukuImageUrl = buku.imageId
      ? `${req.protocol}://${req.get("host")}/buku/image/${buku.id}`
      : null;

    const response = {
      status: 200,
      message: "success",
      data: {
        id: peminjaman._id,
        mahasiswa: {
          id: peminjaman.mahasiswaId._id,
          nama: peminjaman.mahasiswaId.nama,
          nim: peminjaman.mahasiswaId.nim,
          email: peminjaman.mahasiswaId.email,
        },
        buku: {
          judul: buku.judul,
          pengarang: buku.pengarang,
          sinopsis: buku.sinopsis,
          status: buku.status,
          bukuImageUrl,
        },
        tanggalPeminjaman: peminjaman.tanggalPeminjaman,
        tanggalKembali: peminjaman.tanggalKembali,
      },
    };

    res.send(response);
  } catch (error) {
    next(error);
  }
}

async function pinjamBuku(req, res, next) {
  try {
    const result = await peminjamanSchema.validateAsync(req.body);

    const isMahasiswaExist = await Mahasiswa.findById(result.mahasiswaId);
    if (!isMahasiswaExist)
      throw createError.NotFound(
        `Mahasiswa with Mahasiswa ID ${result.mahasiswaId} is Not Found`
      );

    const isBukuExist = await Buku.findById(result.bukuId);
    if (!isBukuExist)
      throw createError.NotFound(
        `Buku with Buku ID ${result.bukuId} is Not Found`
      );

    const peminjaman = new Peminjaman(result);
    await peminjaman.save();

    await Buku.findByIdAndUpdate(result.bukuId, {
      $set: { status: "dipinjam" },
    });

    const response = {
      status: 201,
      message: "added",
      data: peminjaman,
    };

    res.send(response);
  } catch (error) {
    next(error);
  }
}

async function editPeminjaman(req, res, next) {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const peminjaman = await Peminjaman.findByIdAndUpdate(
      id,
      { $set: updateData },
      { returnOriginal: false }
    )
      .populate("mahasiswaId")
      .populate("bukuId");
    if (!peminjaman)
      throw createError.NotFound(
        `Peminjaman with Peminjaman ID ${id} is Not Found`
      );

    const response = {
      status: 200,
      message: "success",
      data: peminjaman,
    };

    res.send(response);
  } catch (error) {
    next(error);
  }
}

async function deletePeminjaman(req, res, next) {
  try {
    const { id } = req.params;

    const peminjaman = await Peminjaman.findOneAndDelete(id);
    if (!peminjaman)
      throw createError.NotFound(
        `Peminjaman with Peminjaman ID ${id} is Not Found`
      );

    const response = {
      status: 200,
      message: "deleted",
    };

    res.send(response);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllPeminjaman,
  getPeminjamanById,
  editPeminjaman,
  pinjamBuku,
  deletePeminjaman,
};
