const router = require("express").Router();
const createUser = require("./createUser");
const passport = require("passport");

router.get("/", (req, res) => {
  console.log(req.session);
  console.log(req.user);
  res.render("index");
});

router.get("/sign-up", (req, res) => {
  res.render("login", { title: "Sign Up" });
});

router.get("/log-in", (req, res) => {
  res.render("login", { title: "Log In" });
});

router.post(
  "/sign-up",
  createUser, // User created
  passport.authenticate("local", {
    // Auth user
    successRedirect: "/",
    failureRedirect: "/boowamp",
  }),
  (req, res) => {
    res.redirect("/");
  }
);

router.post("/log-in", (req, res) => {
  res.send("Log In POST Route");
});

router.get("/boowamp", (req, res) => {
  res.send("boo wamp");
});

router.get("/log-out", (req, res) => {
  req.logout((e, next) => {
    if (e) {
      return next(e);
    }
    res.redirect("/");
  });
});

module.exports = router;
