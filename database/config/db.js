const mongoose = require("mongoose");

const dbUrl =
  "mongodb+srv://suraj:dObEjIui4DyBsH8H@cluster0.8ksly0i.mongodb.net/?retryWrites=true&w=majority";

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
