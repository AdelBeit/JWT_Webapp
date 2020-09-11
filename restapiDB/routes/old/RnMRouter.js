const router = require("express").Router();

// links to external nextjs project
router.get("/RnM", (req, res) => {
  res.redirect("http://localhost:3200");
});

module.exports = router;
