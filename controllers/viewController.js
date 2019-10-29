const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async(req, res) => {
    //GET TOURS DATA FROM COLLECTION
    const tours = await Tour.find();
    //BUILD TEMPLATE

    //RENDER DATA USING TOUR DATA FORM
  
    res.status(200).render("overview", {
        title: "All tours",
        tours
  });
});

exports.getTour = catchAsync(async(req, res) => {
    const tour = await Tour.findOne({ slug: req.params.slug }).populate({
        path: 'reviews',
        fields:'review rating user'
    })
    
  
    res.status(200).render("tour", {
        title: "Tour",
        tour
  });
});
