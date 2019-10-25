const Tour = require("../models/tourModel");
const ApiFeatures = require("../utils/apiFeatures");
const cheapProduct = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "price,-ratingsAverage";
  req.query.fields = "name,price,ratingsAverage";
  next();
};

const getAllTours = async (req, res) => {
  try {
    console.log(req);

    const Feature = new ApiFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitedFields()
      .pagination();

    const nTours = await Feature.query;

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

const getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1;
    console.log(year);
    const plan = await Tour.aggregate([
      {
        $unwind: "$startDates"
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-30`)
          }
        }
      },
      {
        $group: {
          _id: { $month: "$startDates" },
          numTourByMonth: { $sum: 1 },
          tours: { $push: "$name" }
        }
      },
      {
        $addFields: {
          month:'$_id'
        }
      },
      {
        $sort: {
          numTourByMonth: -1
        }
      }
    ]);
    res.status(200).json({
      status: "success",
      data: {
        plan
      }
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error
    });
  }
};

const getToursStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } }
      },
      {
        $group: {
          _id: { $toUpper: "$difficulty" },
          numTours: { $sum: 1 },
          numRatings: { $sum: "$ratingsAverage" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" }
        }
      },
      {
        $sort: {
          avgPrice: 1
        }
      }
    ]);
    res.status(200).json({
      status: "success",
      data: {
        stats
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
    const tour = await Tour.findById(req.params.id).populate('reviews');
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
module.exports = {
  getAllTours,
  createTour,
  getTourById,
  cheapProduct,
  getMonthlyPlan,
  getToursStats
};
