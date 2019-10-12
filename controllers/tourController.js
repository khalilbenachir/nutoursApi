const Tour = require("../models/tourModel");

const getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find();
    res.status(200).json({
      status: "success",
      data: {
        tours
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
module.exports = { getAllTours, createTour, getTourById };
