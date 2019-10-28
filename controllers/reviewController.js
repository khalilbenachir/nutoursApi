const Review = require("../models/reviewModel");
const ApiFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");

const factory = require("./factoryHandler");

exports.setTourUserId = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllReviews = factory.getAll(Review);
exports.getReviewById = factory.getModelById(Review);
exports.createReview = factory.createOne(Review);
exports.deleteReview = factory.deleteOne(Review);


