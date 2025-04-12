const { body, validationResult } = require("express-validator");

/* **********************
 * Validation Rules for Registration
 ********************** */
const registrationRules = () => {
  return [
    body("account_firstname").notEmpty().isLength({ min: 1 }).withMessage("Please provide a first name."),
    body("account_lastname").notEmpty().isLength({ min: 1 }).withMessage("Please provide a last name."),
    body("account_email").isEmail().withMessage("Please provide a valid email address."),
    body("account_password")
      .notEmpty()
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long."),
  ];
};

/* **********************
 * Validation Rules for Login
 ********************** */
const loginRules = () => {
  return [
    body("account_email").isEmail().withMessage("Please provide a valid email address."),
    body("account_password").notEmpty().withMessage("Password is required."),
  ];
};

/* **********************
 * Validation Rules for Account Update
 ********************** */
const updateAccountRules = () => {
  return [
    // Validate first name
    body("account_firstname")
      .trim()
      .isAlpha()
      .withMessage("First name must only contain letters.")
      .isLength({ min: 2 })
      .withMessage("First name must be at least 2 characters long."),
    
    // Validate last name
    body("account_lastname")
      .trim()
      .isAlpha()
      .withMessage("Last name must only contain letters.")
      .isLength({ min: 2 })
      .withMessage("Last name must be at least 2 characters long."),
    
    // Validate email
    body("account_email")
      .isEmail()
      .withMessage("Please enter a valid email address.")
      .custom(async (value, { req }) => {
        const existingAccount = await accountModel.getAccountByEmail(value);
        if (existingAccount && existingAccount.account_id !== req.body.account_id) {
          throw new Error("Email address is already in use.");
        }
      }),
  ];
};

/* **********************
 * Validation Rules for Password Update
 ********************** */
const passwordRules = () => {
  return [
    body("new_password")
      .isStrongPassword({
        minLength: 8,
        minUppercase: 1,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage(
        "Password must be at least 8 characters long and include one uppercase letter, one lowercase letter, one number, and one special character."
      ),
  ];
};

/* **********************
 * Check Validation Results
 ********************** */
const checkRegistrationData = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash("notice", "Please fix the following errors:");
    return res.status(400).render("account/register", {
      title: "Register",
      errors: errors.array(),
      account_firstname: req.body.account_firstname,
      account_lastname: req.body.account_lastname,
      account_email: req.body.account_email,
    });
  }
  next();
};

const checkLoginData = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash("notice", "Please fix the following errors:");
    return res.status(400).render("account/login", {
      title: "Login",
      errors: errors.array(),
      account_email: req.body.account_email,
    });
  }
  next();
};

const checkUpdateAccountData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash("notice", "Please correct the errors in the form.");
    return res.status(400).render("account/update", {
      title: "Update Account Information",
      errors: errors.array(),
      account: req.body, // Preserve sticky data
    });
  }
  next();
};

const checkPasswordData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash("notice", "Please fix the password errors.");
    return res.status(400).render("account/update", {
      title: "Update Account Information",
      errors: errors.array(),
      account: req.body, // Preserve sticky data
    });
  }
  next();
};

module.exports = {
  registrationRules,
  checkRegistrationData,
  loginRules,
  checkLoginData,
  updateAccountRules,
  checkUpdateAccountData,
  passwordRules,
  checkPasswordData,
};
