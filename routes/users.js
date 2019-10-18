const express = require("express");
const router = express.Router();
const userController = require("../controllers/userContoller");
const authController = require("../controllers/authController");

//USERS ROUTE
const { getAllUsers, getUserById } = userController;
const { signUp } = authController;

router.post('/login',authController.login);

router
  .route("/")
  .get(getAllUsers)
  .post(signUp);
router.route("/:id").get(getUserById);

module.exports = router;
