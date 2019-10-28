const mongoose = require("mongoose");
const Tour = require("./tourModel");

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

reviewModel.statics.calcAverageRating = async function(tourId) {
  const stats = await this.aggregate([
    { $match: { tour: tourId } },
    {
      $group: {
        _id: "$tour",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" }
      }
    }
  ]);
  await Tour.findByIdAndUpdate(tourId, {
    ratingsAverage: stats[0].avgRating,
    ratingsQuantity: stats[0].nRating
  });
};
reviewModel.pre("/^findOneAnd/", async function(next) {
  this.r = await this.findOne();
  next();
});

reviewModel.index({ tour: 1, user: 1 }, { unique: true });
reviewModel.post("/^findOneAnd/", async function() {
  await this.r.constructor.calcAverageRating(this.r.tour);
});

reviewModel.post("save", function() {
  Review.calcAverageRating(this.tour);
});

const Review = mongoose.model("Review", reviewModel);
module.exports = Review;
