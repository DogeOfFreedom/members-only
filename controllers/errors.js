const { validationResult } = require("express-validator");

const getFirstErrorMsg = (errors) => errors.errors[0].msg;

const checkForSignUpValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  // Check if error occured
  if (!errors.isEmpty()) {
    const errorMsg = getFirstErrorMsg(errors);
    const localsObj = {
      title: "Sign Up",
      error: errorMsg,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      username: req.body.username,
      password: req.body.password,
      confirm_password: req.body.confirm_password,
    };
    return res.render("login", localsObj);
  }

  // If no errors, continue to next middleware
  return next();
};

const checkForLogInValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  // Check if error occured
  if (!errors.isEmpty()) {
    const errorMsg = getFirstErrorMsg(errors);
    const localsObj = {
      title: "Log In",
      error: errorMsg,
      username: req.body.username,
      password: req.body.password,
    };
    return res.render("login", localsObj);
  }

  // If no errors, continue to next middleware
  return next();
};

const checkForMessageValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  // Check if error occured
  if (!errors.isEmpty()) {
    const errorMsg = getFirstErrorMsg(errors);
    const localsObj = {
      error: errorMsg,
      title: req.body.title,
      message: req.body.message,
    };
    return res.render("createMessage", localsObj);
  }

  // If no errors, continue to next middleware
  return next();
};

module.exports = {
  checkForSignUpValidationErrors,
  checkForLogInValidationErrors,
  checkForMessageValidationErrors,
};
