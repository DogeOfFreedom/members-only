const User = require("../model/user");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const LocalStrategy = require("passport-local");

// Setup Local Strategy
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = (await User.find({ username }))[0];
      if (!user) {
        return done(null, false, { message: "Incorrect Username" });
      }
      const savedPassword = user.password;
      const match = await bcrypt.compare(password, savedPassword);
      if (!match) {
        return done(null, false, { message: "Incorrect Password" });
      }
      return done(null, user);
    } catch (e) {
      return done(e);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id); // Put the user id in the user property of the session object
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

const attemptUserLogIn = (req, res) => {
  console.log(req.user);
  res.send("oop");
};
