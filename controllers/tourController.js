const Tour = require("../models/tourModel");

const cheapProduct = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "price,-ratingsAverage";
  req.query.fields = "name,price,ratingsAverage,description";
  next();
};





const getAllTours = async (req, res) => {
  try {
    console.log(req.query);

    const queryObj = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach(el => delete queryObj[el]);

    let query = JSON.stringify(queryObj);
    query = query.replace(/\b(gte|lte|gt|lt)\b/g, match => `$${match}`);

    let tours = Tour.find(JSON.parse(query));

    if (req.query.sort) {
      const sortedBy = req.query.sort.split(",");
      console.log(sortedBy);
      sortedBy.map(el => (tours = tours.sort(el)));
    } else {
      tours = tours.sort("-createdAt");
    }

    if (req.query.fields) {
      let fields = req.query.fields.split(",").join(" ");
      tours = tours.select(fields);
    } else {
      tours = tours.select("-__v");
    }

    //pagination

    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    tours = tours.skip(skip).limit(limit);

    if (req.query.page) {
      const nmTours = await Tour.countDocuments();
      if (skip >= nmTours) throw new Error("this page doesn't exist");
    }

    const nTours = await tours;

    res.status(200).json({
      status: "success",
      results: nTours.length,
      data: {
        nTours
      }
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error
    });
  }
};

const createTour = async (req, res) => {
  try {
    console.log(req.body);
    const nTour = new Tour(req.body);
    const tour = await nTour.save();
    res.status(201).json({
      status: "success",
      data: {
        tours: tour
      }
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error
    });
  }
};
const getTourById = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: {
        tour
      }
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error
    });
  }
};
module.exports = { getAllTours, createTour, getTourById, cheapProduct };
