const mongoose = require("mongoose");

const user = mongoose.Schema({
  firstname: {
    type: String,
    reqiured: true,
  },
  lastname: {
    type: String,
    reqiured: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isMember: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("User", user);
