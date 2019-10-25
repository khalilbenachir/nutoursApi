const express = require("express");
const router = express.Router();

const reviewController = require("../controllers/reviewController");
const authController = require("../controllers/authController");
//REVIEW ROUTE

router.route("/").get(reviewController.getAllReviews);

router
  .route("/:tourId/reviews")
  .post(
    authController.protect,
    authController.restrict("user"),
    reviewController.createReview
  );

module.exports = router;
