/* eslint-disable import/newline-after-import */
const express = require("express");
const app = express();

const port = 3000;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
})

const router = require("./router");
app.use(router);