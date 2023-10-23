const User = require("../models/userModel");
const mongoose = require("mongoose");
const signup = async (req, res) => {
  // Your signup logic here
  const { name, email, password } = req.body;

  try {
    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const userCount = await User.countDocuments();

    // Increment the avatar number and generate the new avatarUrl
    const nextAvatarNumber = userCount + 1;
    const newAvatarUrl = `/assets/images/avatars/avatar_${nextAvatarNumber}.jpg`;

    // Create a new user instance with the provided data and updated avatarUrl
    const newUser = new User({
      name,
      email,
      password,
      avatarUrl: newAvatarUrl,
    });

    // Save the new user to the database
    await newUser.save();

    // Optionally, you can generate and send a JWT token here for user authentication.

    res
      .status(201)
      .json({ user: newUser, message: "User registered successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getUsers = async (req, res) => {
  try {
    // Retrieve all users from the database
    const users = await User.find({}, { __v: 0 }); // Exclude _id and __v fields from the response
    console.log(users);
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getSessionData = (req, res) => {
  try {
    // Retrieve the user data from the session and send it back in the response
    const userData = req.session.user;
    res.status(200).json(userData);
  } catch (error) {
    console.error("Error fetching session data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user with the provided email in the database
    const user = await User.findOne({ email });

    // If no user with the provided email is found, return an error
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the provided password matches the user's password
    if (user.password !== password) {
      return res.status(401).json({ error: "Email ID or Password is invalid" });
    }
    req.session.user = user;
    req.session.save();
    // Optionally, you can generate and send a JWT token here for user authentication.

    res.status(200).json({ user, message: "Login successful" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const logout = (req, res) => {
  try {
    // Destroy the user session
    req.session.destroy((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      // Send a success message upon successful logout
      res.status(200).json({ message: "Logout successful" });
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

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
};

const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    // Retrieve the user from the database by ID
    const result = await User.findOne({ _id: userId });

    // Check if the user was found
    if (!result) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ user: result, message: "User fetched" });
  } catch (error) {
    console.error("Get user by ID error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedUserData = req.body;

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
    user.isVerified =
      updatedUserData.isVerified !== undefined
        ? updatedUserData.isVerified
        : user.isVerified;
    user.status = updatedUserData.status || user.status;
    user.isLive =
      updatedUserData.isLive !== undefined
        ? updatedUserData.isLive
        : user.isLive;

    // Save the updated user to the database
    await user.save();

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const disableLive = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the isLive flag to false
    user.isLive = false;
    await user.save();

    // Redirect to another website
    res.redirect("https://www.surajzinzuwadia.com");
  } catch (error) {
    console.error("Disable isLive flag error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const subscribeToProducer = async (req, res) => {
  try {
    const { producerId } = req.body;
    const { userId } = req.params;
    if (
      !mongoose.Types.ObjectId.isValid(producerId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return res.status(400).json({ error: "Invalid ObjectId format" });
    }

    const user = await User.findById(userId);
    const producer = await User.findById(producerId);

    if (!user || !producer) {
      return res.status(400).json({ error: "Invalid User ID or producer ID" });
    }

    if (user.subscribed.includes(producerId)) {
      return res
        .status(400)
        .json({ error: "You are already subscribed to this channel" });
    }
    if (producer.subscribers.includes(userId)) {
      return res
        .status(400)
        .json({ error: "User is already subscribed to this producer" });
    }

    user.subscribed.push(producerId);
    await user.save();

    producer.subscribers.push(userId);
    await producer.save();

    res.status(201).json({ message: "Subscription added successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Server error", errorMessage: error.message });
  }
};

const getSubscribers = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate("subscribers");

    if (!user) {
      return res.status(400).json({ error: "Invalid user ID." });
    }

    res.status(200).json(user.subscribers);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const getChannels = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate("subscribed");

    if (!user) {
      return res.status(400).json({ error: "Invalid user ID." });
    }

    res.status(200).json(user.subscribed);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const getSubscriptions = async (req, res) => {
  try {
    const { producerId } = req.params;
    const subscription = await Subscription.findOne({ producerId }).populate(
      "subscribers"
    );

    if (!subscription) {
      return res.status(404).json({ error: "Subscription not found" });
    }

    res.status(200).json({ subscribers: subscription.subscribers });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  signup,
  getUsers,
  getSessionData,
  login,
  logout,
  deleteUser,
  getUserById,
  updateUser,
  disableLive,
  subscribeToProducer,
  getSubscribers,
  getChannels,
  getSubscriptions,
};
