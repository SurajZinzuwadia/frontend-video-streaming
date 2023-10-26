const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");
const requireAuth = require("../middleware/requireAuth"); // Import the middleware

// Define user routes
router.get("/list-users", UserController.getUsers); // Add requireAuth middleware
router.get("/session-data", UserController.getSessionData); // Add requireAuth middleware
router.get("/:id", UserController.getUserById); // Add requireAuth middleware
router.delete("/:id", UserController.deleteUser); // Add requireAuth middleware
router.put("/:id", UserController.updateUser); // Add requireAuth middleware
router.get("/:id/disable-live", UserController.disableLive); // Add requireAuth middleware
router.post(
  "/subscriptions/:userId",

  UserController.subscribeToProducer
);
router.get("/subscribers/:userId", UserController.getSubscribers); // Add requireAuth middleware
router.get("/channels/:userId", UserController.getChannels); // Add requireAuth middleware
router.get(
  "/subscriptions/:producerId",

  UserController.getSubscriptions
);

module.exports = router;
