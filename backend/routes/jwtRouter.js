const express = require("express");
const router = express.Router();
const updateToken = require("../model/mongo").updateToken;
const generateToken = require("../model/JWT").generateToken;

router.post("/getToken", (req, res) => {
  const username = req.body.username;
  const token = generateToken(username);
  updateToken(username, token);
  res.redirect("/home");
});

module.exports = router;
