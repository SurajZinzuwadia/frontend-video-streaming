const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");
// Define user routes
router.post("/signup", UserController.signup);
router.post("/signin", UserController.signin);
router.post("/signout", UserController.signout);

module.exports = router;
