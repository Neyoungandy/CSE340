const express = require('express');
const router = express.Router();
const path = require('path');

// Static Routes
// Set up "public" folder / subfolders for static files
router.use(express.static("public"));

// Fix paths by using path.join() for proper directory resolution
router.use("/css", express.static(path.join(__dirname, "../public/css")));
router.use("/js", express.static(path.join(__dirname, "../public/js")));
router.use("/images", express.static(path.join(__dirname, "../public/images")));

// Add a route handler for the root path
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

module.exports = router;