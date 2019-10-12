const express = require("express");
const router = express.Router();
const tourController = require('../controllers/tourController');
//TOURS ROUTE


router
  .route("/")
  .get(tourController.getAllTours)
  .post(tourController.createTour);

router.route("/:id").get(tourController.getTourById);


module.exports = router;