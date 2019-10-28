const Tour = require("../models/tourModel");
const ApiFeatures = require("../utils/apiFeatures");
const factory = require("./factoryHandler");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const cheapProduct = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "price,-ratingsAverage";
  req.query.fields = "name,price,ratingsAverage";
  next();
};

const getMonthlyPlan = catchAsync(async (req, res) => {
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
        month: "$_id"
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
});

const getToursStats = catchAsync(async (req, res) => {
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
});

const getTourWithin = catchAsync(async (req, res, next) => {
  const { distance, latlong, unit } = req.params;

  const [lat, long] = latlong.split(",");

  const radius = unit === "mi" ? distance / 3963.2 : distance / 6372.1;
  if (!long || !lat)
    return next(new AppError("Please provide latitude and longitude ", 400));

  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[long, lat], radius] } }
  });

  console.log(tours);

  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      tours
    }
  });
});

const getDistances = catchAsync(async (req, res, next) => {
  const { latlong, unit } = req.params;

  const [lat, long] = latlong.split(",");

  if (!long || !lat)
    return next(new AppError("Please provide latitude and longitude ", 400));

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [long * 1, lat * 1]
        },
        distanceField: "distance"
      }
    }
  ]);

  res.status(200).json({
    status: "success",
    results: distances.length,
    data: {
      distances
    }
  });
});

const getAllTours = factory.getAll(Tour);
const createTour = factory.createOne(Tour);
const getTourById = factory.getModelById(Tour);

module.exports = {
  getAllTours,
  createTour,
  getTourById,
  cheapProduct,
  getMonthlyPlan,
  getToursStats,
  getTourWithin,
  getDistances
};
