const mongoose = require("mongoose");

const connectDatabase = async () => {
  const { MONGO_URI } = process.env;

  if (!MONGO_URI) {
    throw new Error("MONGO_URI is missing. Add it to backend/.env.");
  }

  await mongoose.connect(MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
  });
};

module.exports = connectDatabase;

