const router = require("express").Router();

router.get("/", (req, res) => {
    // stump
    res.send("Placeholder :-)")
})

module.exports = router;