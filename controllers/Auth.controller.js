const Mahasiswa = require("../models/Mahasiswa.model");
const { registerSchema, loginSchema } = require("../helpers/validation_schema");
const { signAccessToken } = require("../helpers/jwt_helper");

async function register(req, res, next) {
  try {
    const result = await registerSchema.validateAsync(req.body);

    const doesExist = await Mahasiswa.findOne({ email: result.email });
    if (doesExist)
      throw createError.Conflict(`${result.email} is already been registered.`);

    const mahasiswa = new Mahasiswa(result);
    await mahasiswa.save();

    const response = {
      status: 201,
      message: "registered",
    };

    res.send(response);
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const result = await loginSchema.validateAsync(req.body);
    const mahasiswa = await Mahasiswa.findOne({ email: result.email });
    if (!mahasiswa) throw createError.NotFound("User not registered");

    const isMatch = await mahasiswa.isValidPassword(result.password);
    if (!isMatch)
      throw createError.Unauthorized("Either Email / Password is Incorrect");

    const accessToken = await signAccessToken(mahasiswa.nim);

    const response = {
      status: 200,
      message: "success",
      data: {
        email: mahasiswa.email,
        token: accessToken,
      },
    };

    res.send(response);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
};
