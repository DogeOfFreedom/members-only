/* eslint-disable import/newline-after-import */
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
const express = require("express");
const passport = require("passport");
const app = express();
const MongoStore = require("connect-mongo");

// cors setup
const cors = require("cors");
const allowedOrigin = process.env.ORIGIN || "http://127.0.0.1:5173";
app.use(cors({ origin: allowedOrigin, methods: "GET, POST, DELETE, PUT" }));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

// Connect to db
const mongoDB = process.env.MONGODB_URI || process.env.DEV_DB;
mongoose
  .connect(mongoDB)
  .then(() => console.log("connected to db"))
  .catch((e) => console.log(e));

// Passport setup
require("./controllers/passport");

// Configure session store
const sessionStore = MongoStore.create({
  mongoUrl: mongoDB,
  mongooseConnection: mongoose.connection,
  collection: "session",
});

// Session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);
app.use(passport.session());

// public directory for serving the static files.
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const router = require("./controllers/router");
app.use(router);

// error handler for when all routes fail
app.use((err, req, res, next) => {
  // render the error page
  console.log(err);
  res.status(err.status || 500);
  res.render("error");
});
