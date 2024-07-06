const User = require("../model/user");

const verifyCode = async (req, res) => {
  const secretCode = 6945;
  const { code } = req.body;
  if (secretCode === Number(code)) {
    try {
      const { _id } = req.user;
      const user = await User.findById(_id);
      user.isMember = true;
      await user.save();
      res.redirect("/");
    } catch (e) {
      console.log(e);
      res.redirect("/error");
    }
  } else {
    res.render("join", { error: "Wrong" });
  }
};

module.exports = { verifyCode };
