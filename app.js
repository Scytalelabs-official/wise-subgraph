var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");

var app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const { graphqlHTTP } = require("express-graphql");
const schema = require("./graphql/schema");
var listenerRouter = require("./routes/listenerroutes");
const depositedLiquidityRoute = require("./routes/depositedLiquidityRoute");
const formedLiquidityRoute = require("./routes/formedLiquidityRoute");
const masterRecordRoute = require("./routes/masterRecordRoute");
const withdrawalRoute = require("./routes/withdrawalRoute");
const uniswapSwapResultRoute = require("./routes/uniswapSwapResultRoutes");
const stakeRoute = require("./routes/stakeRoute");
const globalRoutes = require("./routes/globalRoutes");
const userRoutes = require("./routes/userRoute");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/", depositedLiquidityRoute);
app.use("/", formedLiquidityRoute);
app.use("/", masterRecordRoute);
app.use("/", withdrawalRoute);
app.use("/", uniswapSwapResultRoute);
app.use("/", stakeRoute);
app.use("/", globalRoutes);
app.use("/", userRoutes);

var DB_URL;

if (process.env.NODE_MODE == "deployed") {
  DB_URL = process.env.DATABASE_URL_ONLINE;
} else {
  DB_URL = process.env.DATABASE_URL_LOCAL;
}

console.log("DB_URL : " + DB_URL);

const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: false,
};
const connect = mongoose.connect(DB_URL, connectionParams);
// connecting to the database
connect.then(
  (db) => {
    console.log("Connected to the MongoDB server\n\n");
  },
  (err) => {
    console.log(err);
  }
);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use("/", indexRouter);
app.use("/", listenerRouter);

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
