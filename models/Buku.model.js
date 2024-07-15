const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BukuSchema = new Schema({
  judul: {
    type: String,
    required: true,
  },
  pengarang: {
    type: String,
    required: true,
  },
  sinopsis: {
    type: String,
    required: true,
  },
  imageId: {
    type: Schema.Types.ObjectId,
    ref: "GridFSFile",
    required: true,
  },
  status: {
    type: String,
    enum: ["tersedia", "dipinjam"],
    required: true,
  },
});

BukuSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret.__id;
    delete ret._id;
    delete ret.__v;

    return {
      id: ret.id,
      judul: ret.judul,
      pengarang: ret.pengarang,
      sinopsis: ret.sinopsis,
      status: ret.status,
    };
  },
});

const Buku = mongoose.model("buku", BukuSchema);
module.exports = Buku;
