const router = require("express").Router();
const logout = require("../model/mongo").logout;

router.get("/", (req, res) => {
  logout;
});
