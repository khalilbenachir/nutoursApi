const Review = require("../models/reviewModel");
const catchAsync = require("../utils/catchAsync");

const getAllReviews = catchAsync(async (req, res) => {
  let filter = req.params.tourId ? { tour: req.params.tourId } : {};

  const reviews = await Review.find(filter);

  res.status(200).json({
    status: "success",
    results: reviews.length,
    data: {
      reviews
    }
  });
});

const getReviewById = catchAsync(async (req, res) => {
  const review = await Review.findById(req.params.id);
  res.status(200).json({
    status: "success",
    data: {
      review
    }
  });
});

const createReview = catchAsync(async (req, res) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  const nReview = new Review(req.body);
  const review = await nReview.save();
  res.status(201).json({
    status: "success",
    data: {
      review: review
    }
  });
});

module.exports = { getReviewById, getAllReviews, createReview };
