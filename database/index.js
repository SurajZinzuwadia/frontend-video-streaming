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

// Schema for Users
const userSchema = new mongoose.Schema({
  name: {
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
  avatarUrl: {
    type: String,
    default: `/assets/images/avatars/avatar_1.jpg`
  },
  isVerified: {
    type: Boolean,
    default: true, // Set the default value to true for isVerified
  },
  status: {
    type: String,
    enum: ['active', 'banned'],
    default: 'active', // Set the default value to 'active' for status
    required: true,
  },
  subscribers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  subscribed: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  
});
const User = mongoose.model("User", userSchema);

// Schema for subscription
const subscriptionSchema = new mongoose.Schema({
  producerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    validate: {
      validator: async function (value) {
        const user = await mongoose.model('User').findById(value);
        return user && user.userType === 'producer';
      },
      message: 'Invalid producerId. The user must be a producer.',
    },
  },
  subscribers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);
// ... (The rest of your code remains the same)

app.post("/api/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Email already registered" });
    }

    // Create a new user instance with the provided data
    const newUser = new User({ name, email, password });

    // Save the new user to the database
    await newUser.save();

    // Optionally, you can generate and send a JWT token here for user authentication.

    res.status(201).json({ user: newUser, message: "User registered successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/users", async (req, res) => {
  try {
    // Retrieve all users from the database
    const users = await User.find({}); // Exclude _id and __v fields from the response
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

    res.status(200).json({ user: user, message: "Login successful" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete a user by ID
app.delete("/api/users/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    // Delete the user from the database
    const result = await User.deleteOne({ _id: userId });

    // Check if the user was found and deleted successfully
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



app.put("/api/users/:id", async (req, res) => {
  const userId = req.params.id;
  const updatedUserData = req.body;

  try {
    // Find the user with the provided ID in the database
    const user = await User.findById(userId);

    // If no user with the provided ID is found, return an error
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the user data
    user.userType = updatedUserData.userType || user.userType;
    user.name = updatedUserData.name || user.name;
    user.email = updatedUserData.email || user.email;
    user.password = updatedUserData.password || user.password;
    user.avatarUrl = updatedUserData.avatarUrl || user.avatarUrl;
    user.isVerified = updatedUserData.isVerified !== undefined ? updatedUserData.isVerified : user.isVerified;
    user.status = updatedUserData.status || user.status;

    // Save the updated user to the database
    await user.save();

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.post('/api/subscriptions/:userId', async (req, res) => {
  try {
    const { producerId } = req.body;
    const { userId } = req.params;
    // Validate that the producerId and userId are valid ObjectId strings
    if (!mongoose.Types.ObjectId.isValid(producerId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid ObjectId' });
    }

    // Ensure that the producerId is a valid producer
    const producer = await User.findById(producerId);
    const user = await User.findById(userId);
    if (!user || !producer) {
      return res.status(400).json({ error: 'Invalid User ID or producer ID' });
    }

    // Check if the subscription already exists
    if (user.subscribed.includes(producerId)) {
      return res.status(400).json({ error: 'Subscription already exists' });
    }

    if (producer.subscribers.includes(userId)) {
      return res.status(400).json({ error: 'Subscriber already exists' });
    }
    
    user.subscribed.push(producerId);
    await user.save();
    producer.subscribers.push(userId);
    await producer.save();
    // Subscription added successfully
    res.status(201).json({ message: 'Subscription added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error', errorMessage: error.message }); // Return the error message to the client
  }
});

// Assuming you have already defined the User and Subscription models and have connected to the MongoDB database

// GET all producers from subscriberId
// GET all producers from subscriberId
app.get('/api/subscribers/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the subscriber in the User collection
    const user = await User.findById(userId).populate('subscribers'); // Populate the 'subscribers' field with selected fields
    if (!user) {
      return res.status(400).json({ error: 'Invalid user ID.' });
    }
    console.log(user)
    res.status(200).json(user.subscribers);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});


app.get('/api/subscriptions/:producerId', async (req, res) => {
  try {
    const { producerId } = req.params;

    // Find the subscription document for the provided producerId
    const subscription = await Subscription.findOne({ producerId }).populate('subscribers');

    // Check if the subscription exists
    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    res.status(200).json({ subscribers: subscription.subscribers });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});
connect();
const port = 3001;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
