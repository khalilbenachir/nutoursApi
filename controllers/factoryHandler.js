const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const ApiFeatures = require("../utils/apiFeatures");

exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc)
      return next(new AppError("there's no document with that ID", 404));
    res.status(204).json({
      status: "success",
      data: null
    });
  });

exports.createOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = new Model(req.body);
    const document = await doc.save();
    res.status(201).json({
      status: "success",
      data: {
        document
      }
    });
  });

exports.getModelById = Model =>
  catchAsync(async (req, res, next) => {
    const document = await Model.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: {
        document
      }
    });
  });

exports.getAll = Model => 
  catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };
    const Feature = new ApiFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitedFields()
      .pagination();

    const document = await Feature.query;

    res.status(200).json({
      status: "success",
      sizes:document.length,
      data: document
    });
  });
;



