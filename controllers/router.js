const router = require("express").Router();
const createUser = require("./createUser");
const passport = require("passport");
const { body } = require("express-validator");
const {
  checkForSignUpValidationErrors,
  checkForLogInValidationErrors,
  checkForMessageValidationErrors,
} = require("./errors");
const { verifyCode } = require("./join");
const { isAuth } = require("./util");
const { createMessage, getMessages, deleteMessage } = require("./message");
const expressAsyncHandler = require("express-async-handler");

router.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    const messages = await getMessages();
    if (req.user) {
      res.render("index", {
        authenticated: req.isAuthenticated(),
        isMember: req.user.isMember,
        isAdmin: req.user.isAdmin,
        messages,
      });
    } else {
      res.render("index", { messages });
    }
  })
);

router.get("/sign-up", (req, res) => {
  res.render("login", { title: "Sign Up" });
});

router.get("/log-in", (req, res) => {
  res.render("login", { title: "Log In" });
});

router.get("/log-out", (req, res) => {
  req.logout((e, next) => {
    if (e) {
      return next(e);
    }
    return res.redirect("/");
  });
});

router.get("/create-message", (req, res) => {
  res.render("createMessage");
});

// Authenticated Routes
router.get("/join", isAuth, (req, res) => {
  res.render("join");
});

router.post("/join", isAuth, verifyCode);

// Create Msg Post Route
router.post(
  "/create-message",
  isAuth,
  body("title").trim().escape().notEmpty().withMessage("Title cannot be empty"),
  body("message")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Message cannot be empty")
    .isLength({ max: 250 })
    .withMessage("Cannot be more then 250 characters"),
  checkForMessageValidationErrors,
  createMessage
);

// Sign Up Post Route
router.post(
  "/sign-up",
  body("firstname")
    .trim()
    .notEmpty()
    .escape()
    .withMessage("First name cannot be empty")
    .isAlpha()
    .withMessage("First name must only contain alphabetic characters")
    .isLength({ max: 20 })
    .withMessage("Cannot be more then 20 characters"),
  body("lastname")
    .trim()
    .notEmpty()
    .escape()
    .withMessage("Last name cannot be empty")
    .isAlpha()
    .withMessage("Last name must only contain alphabetic characters")
    .isLength({ max: 20 })
    .withMessage("Cannot be more then 20 characters"),
  body("username")
    .trim()
    .notEmpty()
    .escape()
    .withMessage("Username cannot be empty")
    .isLength({ max: 15 })
    .withMessage("Username cannot be longer than 15 characters")
    .isLength({ max: 20 })
    .withMessage("Cannot be more then 20 characters"),
  body("password")
    .trim()
    .notEmpty()
    .escape()
    .withMessage("Password cannot be empty")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .isLength({ max: 20 })
    .withMessage("Cannot be more then 20 characters"),
  body("confirm_password")
    .trim()
    .notEmpty()
    .escape()
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Confirm password must match"),
  checkForSignUpValidationErrors,
  createUser, // User created
  passport.authenticate("local", {
    // Auth user
    successRedirect: "/",
    failureRedirect: "/sign-in",
  })
);

// Log In Post Route
router.post(
  "/log-in",
  body("username").trim().notEmpty().escape(),
  body("password").trim().notEmpty().escape(),
  checkForLogInValidationErrors,
  (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.render("login", {
          username: req.body.username,
          password: req.body.password,
          error: "Incorrect User Details",
          title: "Log In",
        });
      }
      req.login(user, () => res.redirect("/"));
    })(req, res, next);
  }
);

// Delete Message Route
router.get("/delete_msg/:id", deleteMessage);

module.exports = router;
