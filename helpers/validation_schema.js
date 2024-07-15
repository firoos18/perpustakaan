const Joi = require("@hapi/joi");

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  nama: Joi.string().required(),
  nim: Joi.string().required(),
  password: Joi.string().required(),
  repeatPassword: Joi.ref("password"),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const addBukuSchema = Joi.object({
  judul: Joi.string().required(),
  pengarang: Joi.string().required(),
  sinopsis: Joi.string().required(),
  status: Joi.string().required(),
  imageId: Joi.string(),
});

const peminjamanSchema = Joi.object({
  mahasiswaId: Joi.string().required(),
  bukuId: Joi.string().required(),
  tanggalPeminjaman: Joi.date().required(),
  tanggalKembali: Joi.date().required(),
});

module.exports = {
  registerSchema,
  loginSchema,
  addBukuSchema,
  peminjamanSchema,
};
