const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PeminjamanSchema = new Schema({
  mahasiswaId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "mahasiswa",
  },
  bukuId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "buku",
  },
  tanggalPeminjaman: {
    type: Date,
    required: true,
  },
  tanggalKembali: {
    type: Date,
    required: true,
  },
});

PeminjamanSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;

    return {
      id: ret.id,
      mahasiswaId: ret.mahasiswaId,
      bukuId: ret.bukuId,
      tanggalPeminjaman: ret.tanggalPeminjaman,
      tanggalKembali: ret.tanggalKembali,
    };
  },
});

const Peminjaman = mongoose.model("peminjaman", PeminjamanSchema);
module.exports = Peminjaman;
