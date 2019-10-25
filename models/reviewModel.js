const mongoose = require("mongoose");

const reviewModel = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "Review can't be empty"]
    },
    rating: {
      type: Number,
      min: 0,
      max: 5
    },
    createdAt: {
      type: Date,
      default: Date.now()
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: [true, "Review must belong to a tour."]
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user."]
    }
  },
  {
    toObject: {
      virtuals: true
    },
    toJSON: {
      virtuals: true
    }
  }
);

reviewModel.pre(/^find/, function(next) {
    this.populate({
      path: "user",
      select: "name photo"
    });
    next();
});


const Review = mongoose.model("Review", reviewModel);
module.exports = Review;
