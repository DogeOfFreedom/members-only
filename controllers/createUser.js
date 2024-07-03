const bcrypt = require("bcryptjs");
const User = require("../model/user");
const asyncHandler = require("express-async-handler");

const createUser = (req, res, next) => {
  const { username, password } = req.body;
  bcrypt.hash(
    password,
    10,
    asyncHandler(async (err, hashedPassword) => {
      if (err) {
        return next(err);
      }
      const newUser = {
        username,
        password: hashedPassword,
      };
      await User.create(newUser).then(() => console.log("new user created"));
      return next();
    })
  );
};

module.exports = createUser;
