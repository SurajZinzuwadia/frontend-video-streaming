const mongoose = require("mongoose");
require("dotenv").config();

const dbUrl = process.env.DB_URL;

async function connect() {
  try {
    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to the database");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
}

module.exports = connect;
