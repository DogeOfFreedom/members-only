const { DateTime } = require("luxon");

const isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect("/log-in");
};

const convertDate = (date) =>
  DateTime.fromJSDate(date).toLocaleString(DateTime.DATE_MED);

const capitalize = (str) => str.slice(0, 1).toUpperCase() + str.slice(1);

module.exports = { isAuth, convertDate, capitalize };
