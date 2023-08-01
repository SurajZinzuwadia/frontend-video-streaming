// require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const cors = require('cors');

// const bodyParser = require("body-parser");
// const cors = require("cors");
const pass = "SmitPatel";
const dbUrl =
  "mongodb+srv://chintupatel61098:ImjCIEj6kWn6LibQ@nodedemo.y4to5j5.mongodb.net/StreamAuth?retryWrites=true&w=majority";
// "mongodb+srv://chintupatel61098@gmail.com:SmitPatel@nodedemo.y4to5j5.mongodb.net";
app.use(cors());
app.use(express.json());
// app.use(cors());
// const connectionParams = {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// };
// MongoDB setup using Mongoos
async function connect() {
  try {
    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("connected");
  } catch (error) {
    console.log(error);
  }
}

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("User", userSchema);

connect();
const port = 3001;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// ... (The rest of your code remains the same)

app.post("/api/signup", async (req, res) => {
  const { firstname, email, password } = req.body;

  try {
    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Email already registered" });
    }

    // Create a new user instance with the provided data
    const newUser = new User({ firstname, email, password });

    // Save the new user to the database
    await newUser.save();

    // Optionally, you can generate and send a JWT token here for user authentication.

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/users", async (req, res) => {
  try {
    // Retrieve all users from the database
    const users = await User.find({}, { _id: 0, __v: 0 }); // Exclude _id and __v fields from the response
    console.log(users);
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user with the provided email in the database
    const user = await User.findOne({ email });

    // If no user with the provided email is found, return an error
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the provided password matches the user's password
    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Optionally, you can generate and send a JWT token here for user authentication.

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});