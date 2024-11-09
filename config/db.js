import mongoose from "mongoose";
const config = require("../config/config");
const configuration = config.default[process.env.NODE_ENV];

const db = configuration.DB;
const MONGO_URL = `mongodb://localhost:${db.DB_PORT}/${db.DB_NAME}`;

// console.log(MONGO_URL);
const dbConnection = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to DB");
  } catch (error) {
    console.log("error in connecting to DB");
  }
};

module.exports = dbConnection;



