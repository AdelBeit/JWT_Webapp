const express = require("express");
const router = express.Router();
const authenticateUser = require("../model/mongo").authenticateUser;

/* GET home page. */
router.get("/", function (req, res, next) {
  res.redirect("localhost:3200/login");
});

router.post("/", (req, res) => {
  // get user details from request
  const username = req.body.username;
  const password = req.body.password;
  // authenticate it
  authenticateUser(username, password);
});

module.exports = router;
