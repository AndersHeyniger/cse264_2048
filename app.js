// Anders Heyniger
// avh226
// Final Programming Assignment

const express = require("express");
const path = require("path");

const app = express();

app.use(express.static(
  path.resolve(__dirname, "public")
));

app.listen(3000, () => console.log("Starting up 2048"));


