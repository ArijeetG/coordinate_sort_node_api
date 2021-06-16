require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const indexRouter = require("./routes/indexRouter");

mongoose.connect(process.env.MONGO_URI, { useUnifiedTopology: true, useNewUrlParser: true }, () =>
  console.log("connected to database")
);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/app/v1", indexRouter);

app.listen(process.env.PORT || 3000, () =>
  console.log(`listening to port ${process.env.PORT || 3000}`)
);
