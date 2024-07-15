const createError = require("http-errors");
const http = require("http");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./helpers/init_mongodb");
const BukuRoute = require("./routes/Buku.route");
const AuthRoute = require("./routes/Auth.route");
const PeminjamanRoute = require("./routes/Peminjaman.route");
const bodyParser = require("body-parser");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

const corsOpts = {
  origin: "*",

  methods: ["GET", "POST", "PATCH", "DELETE"],

  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOpts));
app.options("*", cors(corsOpts));

app.get("/", async (req, res, next) => {
  res.send("Hello it's Perpustakaan Backend");
});

app.use("/auth", AuthRoute);
app.use("/buku", BukuRoute);
app.use("/peminjaman", PeminjamanRoute);

app.use(async (req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
});

const server = http.createServer(app);

server.setTimeout(6000, (socket) => {
  console.log("Request has timed out");
  socket.end("Request has timed out");
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
