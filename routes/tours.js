const express = require("express");
const router = express.Router();

const tourController = require("../controllers/tourController");
const authController = require('../controllers/authController');
//TOURS ROUTE

router
  .route("/top-5-tours")
  .get(tourController.cheapProduct, tourController.getAllTours);


router
.route("/tours-stats")
  .get(tourController.getToursStats);

  router
.route("/monthly-plan/:year")
.get(tourController.getMonthlyPlan);
router
  .route("/")
  .get(authController.protect,tourController.getAllTours)
  .post(tourController.createTour);

router.route("/:id").get(tourController.getTourById);


 
module.exports = router;
