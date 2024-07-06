const bcrypt = require("bcryptjs");
const User = require("../model/user");
const asyncHandler = require("express-async-handler");

const createUser = (req, res, next) => {
  const { firstname, lastname, username, password, isAdmin } = req.body;
  bcrypt.hash(
    password,
    10,
    asyncHandler(async (err, hashedPassword) => {
      if (err) {
        return next(err);
      }
      let newUser = {
        firstname,
        lastname,
        username,
        password: hashedPassword,
      };
      if (isAdmin) {
        newUser = { ...newUser, isAdmin: true };
      }
      await User.create(newUser).then(() => console.log("new user created"));
      return next();
    })
  );
};

module.exports = createUser;
