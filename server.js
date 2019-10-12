const mongoose = require("mongoose");
const app = require("./app");

const DB = process.env.DB_ACCESS.replace("<password>", process.env.DB_PASSWORD);

mongoose
  .connect(DB, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(conn => {
    console.log("DB connected");
  })
  .catch(err => {
    console.log(err.message);
  });

const port = 3000;
app.listen(port, () => {
  console.log(`Server started on ${port}`);
});
