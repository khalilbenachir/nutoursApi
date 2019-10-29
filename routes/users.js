const express = require("express");
const router = express.Router();
const userController = require("../controllers/userContoller");
const authController = require("../controllers/authController");

//USERS ROUTE
const { getAllUsers, getUserById } = userController;
const { signUp } = authController;

router.post("/login", authController.login);
router.post("/forgotpassword", authController.forgotPassword);
router.post("/resetpassword/:token", authController.resetPassword);

router.use(authController.protect);

router.patch(
  "/updateMe",
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);

router.post("/updatepassword", authController.updatePassword);
router.route("/me").get(userController.getMe, userController.getUserById);

router.use(authController.restrict("admin"));

router
  .route("/")
  .get(getAllUsers)
  .post(signUp);
router.route("/:id").get(getUserById);

module.exports = router;
