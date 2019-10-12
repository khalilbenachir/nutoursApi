const mongoose = require("mongoose");

const tourModel = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A tour must have a name"]
  },
  rating: {
    type: Number,
    default: 4.5
  },
  price: {
    type: Number,
    required: [true, "A tour must have a price"]
  }
});

const Tour = mongoose.model("Tour", tourModel);
module.exports = Tour;
