const feedbackModel = require("../models/feedbackModel");
const utilities = require("../utilities/index");

// Render the feedback form
const showFeedbackForm = (req, res) => {
    res.render("feedback/feedback-form", {
        title: "Leave Feedback",
        errors: [],
        notice: req.flash("info"), // Flash message for notices
    });
};

// Process feedback form submission
const processFeedbackForm = async (req, res) => {
    const { feedback_text } = req.body;
    const account_id = req.session.accountData?.account_id; // Ensure the user is logged in

    // Validation: Check feedback text
    if (!feedback_text || feedback_text.trim().length < 5) {
        return res.render("feedback/feedback-form", {
            title: "Leave Feedback",
            errors: ["Feedback must be at least 5 characters long."],
            notice: req.flash("info"), // Retain the flash message
        });
    }

    try {
        await feedbackModel.addFeedback(account_id, feedback_text.trim());
        req.flash("info", "Feedback has been received! Thank you for being a loyal customer."); // Updated success message
        res.redirect("/feedback"); // Redirect to feedback form after success
    } catch (error) {
        console.error("Error processing feedback:", error);
        res.render("feedback/feedback-form", {
            title: "Leave Feedback",
            errors: ["An error occurred. Please try again later."],
            notice: req.flash("info"),
        });
    }
};

// Display all feedback for admin view
const displayAllFeedback = async (req, res) => {
    try {
        const feedbackList = await feedbackModel.getAllFeedback();

        // Debugging: Verify the fetched data
        console.log("Feedback List Data:", feedbackList);

        res.render("feedback/feedback-list", {
            title: "User Feedback",
            feedbackList, // Pass feedback data to the view
        });
    } catch (error) {
        console.error("Error fetching feedback:", error);
        res.status(500).render("500", { title: "Internal Server Error" }); // Use a dedicated error page
    }
};

module.exports = {
    showFeedbackForm,
    processFeedbackForm,
    displayAllFeedback,
};
