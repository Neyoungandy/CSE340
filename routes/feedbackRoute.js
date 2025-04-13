const express = require("express");
const router = express.Router();
const feedbackController = require("../controllers/feedbackController");
const utilities = require("../utilities/index");

// Routes for feedback
router.get("/", utilities.checkJWTToken, feedbackController.showFeedbackForm); // Display feedback form
router.post("/", utilities.checkJWTToken, feedbackController.processFeedbackForm); // Process feedback submission
router.get("/all", utilities.checkJWTToken, utilities.checkAccountType, feedbackController.displayAllFeedback); // Admin view for feedback

module.exports = router;
