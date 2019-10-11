const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.json());
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const getAllTours = (req, res) => {
  res.status(200).json({
    status: "success",
    result: tours.length,
    requestAt: req.requestTime,
    data: {
      tours
    }
  });
};

const createTour = (req, res) => {
  const tourId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: tourId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    err => {
      res.status(201).json({
        status: "success",
        data: {
          tour: newTour
        }
      });
    }
  );
};
const getTourById = (req, res) => {
  const tour = tours.find(tour => tour.id === parseInt(req.params.id));
  !tour
    ? res.status(404).json({
        status: "fail",
        message: "invalid ID"
      })
    : res.status(200).json({
        status: "success",
        data: {
          tour
        }
      });
};
app
  .route("/api/v1/tours")
  .get(getAllTours)
  .post(createTour);

app.route("/api/v1/tours/:id").get(getTourById);

const port = 3000;
app.listen(port, () => {
  console.log(`Server started on ${port}`);
});
