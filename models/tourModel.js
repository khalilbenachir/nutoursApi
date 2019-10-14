const mongoose = require("mongoose");

const tourModel = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A tour must have a name"],
    trim: true
  },
  ratingsAverage: {
    type: Number,
    default: 4.5
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true
  },
  duration: {
    type: Number,
    required: [true, "A tour must have a duration"]
  },
  difficulty: {
    type: String,
    required: [true, "A tour must have a difficulty"]
  },
  maxGroupSize: {
    type: Number,
    required: [true, "A tour must have a groupe size"]
  },
  price: {
    type: Number,
    required: [true, "A tour must have a price"]
  },
  description: {
    type: String,
    required: [true, "A tour must have a description"]
  },
  imageCover: {
    type: String,
    required: [true, "A tour must have a image cover"]
  },
  images: {
    type: [String]
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  },
  startDates: [Date]
});

const Tour = mongoose.model("Tour", tourModel);
module.exports = Tour;
