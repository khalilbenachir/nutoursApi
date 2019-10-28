const express = require("express");
const router = express.Router();

const reviewRouter = require("./review");

const tourController = require("../controllers/tourController");
const authController = require("../controllers/authController");
//TOURS ROUTE

router
  .route("/top-5-tours")
  .get(tourController.cheapProduct, tourController.getAllTours);

router.route("/tours-stats").get(tourController.getToursStats);

router
  .route("/tour-within/:distance/center/:latlong/unit/:unit")
  .get(tourController.getTourWithin);

router
  .route("/distances/center/:latlong/unit/:unit")
  .get(tourController.getDistances);

router.route("/monthly-plan/:year").get(tourController.getMonthlyPlan);
router
  .route("/")
  .get(tourController.getAllTours)
  .post(authController.protect, tourController.createTour);

router.route("/:id").get(tourController.getTourById);

router.use("/:tourId/reviews", reviewRouter);

module.exports = router;
