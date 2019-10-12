const express = require("express");
const router = express.Router();
const userController = require("../controllers/userContoller");

//USERS ROUTE
const { getAllUsers, createUser, getUserById } = userController;

router
  .route("/")
  .get(getAllUsers)
  .post(createUser);
router.route("/:id").get(getUserById);

module.exports = router;
