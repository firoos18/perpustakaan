const mongoose = require("mongoose");

mongoose
  .connect(process.env.DB_URI)
  .then(() => {
    console.log(`Mongoose Connected to the ${process.env.DB_NAME} Database`);
  })
  .catch((error) => {
    console.log(error);
  });

let gfs;
mongoose.connection.once("open", () => {
  gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "uploads",
  });
  console.log("GridFS initialized");
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose connection is disconnected.");
});

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  process.exit(0);
});

const getGfs = () => {
  if (!gfs) {
    throw new Error("gfs not initialized");
  }
  return gfs;
};

module.exports = { getGfs };
