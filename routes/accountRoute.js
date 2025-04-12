const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountController"); // Controller functions
const utilities = require("../utilities/index"); // Utility functions
const regValidate = require("../utilities/account-validation"); // Validation rules

// Deliver the login view (GET request)
router.get(
  "/login",
  utilities.handleErrors(accountController.accountLoginView)
);

// Process the login request (POST request)
router.post(
  "/login",
  regValidate.loginRules(), // Validate login data
  regValidate.checkLoginData, // Check for errors in login data
  utilities.handleErrors(accountController.accountLogin) // Controller to process the login
);

// Deliver account management view (GET request)
// Added checkLogin middleware for general authorization
router.get(
  "/",
  utilities.checkJWTToken,    // Ensures the JWT token is valid
  utilities.checkLogin,       // Ensures the user is logged in
  utilities.handleErrors(accountController.accountManagementView) // Controller to render the management view
);

// Deliver the update account view (GET request)
router.get(
  "/update/:account_id",
  utilities.checkJWTToken,    // Ensures the JWT token is valid
  utilities.checkLogin,       // Ensures the user is logged in
  utilities.handleErrors(accountController.showUpdateAccountView) // Controller to render the update account view
);

// Process the update account form (POST request)
router.post(
  "/update",
  utilities.checkJWTToken,    // Ensures the JWT token is valid
  utilities.checkLogin,       // Ensures the user is logged in
  regValidate.updateAccountRules(), // Validate account update data
  regValidate.checkUpdateAccountData, // Check for errors in account update data
  utilities.handleErrors(accountController.processUpdateAccount) // Controller to process the update account form
);

// Process the password update form (POST request)
router.post(
  "/update-password",
  utilities.checkJWTToken,    // Ensures the JWT token is valid
  utilities.checkLogin,       // Ensures the user is logged in
  regValidate.passwordRules(), // Validate password data
  regValidate.checkPasswordData, // Check for errors in password data
  utilities.handleErrors(accountController.processUpdatePassword) // Controller to process the password update form
);

// Deliver the registration view (GET request)
router.get(
  "/register",
  utilities.handleErrors(accountController.accountRegisterView) // Controller to render the registration view
);

// Process the registration form (POST request)
router.post(
  "/register",
  regValidate.registrationRules(), // Validate registration data
  regValidate.checkRegistrationData, // Check for errors in registration data
  utilities.handleErrors(accountController.accountRegister) // Controller to process the registration
);

// Logout route (GET request)
router.get("/logout", (req, res) => {
  res.clearCookie("jwt"); // Clear the JWT cookie
  req.flash("notice", "You have successfully logged out.");
  res.redirect("/account/login"); // Redirect to login page
});

// Export the router
module.exports = router;
