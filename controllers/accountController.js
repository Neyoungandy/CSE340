const jwt = require("jsonwebtoken");
require("dotenv").config(); // Load environment variables
const bcrypt = require("bcryptjs"); // For hashing and comparing passwords
const accountModel = require("../models/accountModel"); // Import the account model
const utilities = require("../utilities/index"); // Import utility functions

/* ****************************************
 * Deliver login view
 * ************************************ */
async function accountLoginView(req, res) {
  const nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
    notice: req.flash("notice"), // Pass the 'notice' variable to the view
    account_email: "", // Pre-populated email field (optional)
  });
}

/* ****************************************
 * Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;

  // Check if the account exists in the database
  const accountData = await accountModel.getAccountByEmail(account_email);
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      notice: req.flash("notice"), // Pass the 'notice' variable to the view
      account_email, // Re-populate email field after login failure
    });
    return;
  }

  try {
    // Compare the entered password with the hashed password in the database
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password; // Remove sensitive data before creating token
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 }); // Token valid for 1 hour
      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 });
      }
      return res.redirect("/account/"); // Redirect to the account management view
    } else {
      req.flash("notice", "Please check your credentials and try again.");
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        notice: req.flash("notice"), // Pass the 'notice' variable to the view
        account_email, // Re-populate email field after login failure
      });
    }
  } catch (error) {
    console.error("Error during login process:", error);
    req.flash("notice", "An unexpected error occurred. Please try again.");
    res.status(500).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      notice: req.flash("notice"), // Pass the 'notice' variable to the view
      account_email,
    });
  }
}

/* ****************************************
 * Deliver account management view
 * ************************************ */
async function accountManagementView(req, res) {
  const nav = await utilities.getNav();
  res.render("account/management", {
    title: "Account Management",
    nav,
    accountData: res.locals.accountData, // Pass account data explicitly
    notice: req.flash("notice"), // Pass the 'notice' variable to the view
    errors: null,
  });
}

/* ****************************************
 * Deliver update account view
 * ************************************ */
async function showUpdateAccountView(req, res) {
  const nav = await utilities.getNav();
  try {
    const accountId = req.params.account_id;
    const accountData = await accountModel.getAccountById(accountId); // Fetch account by ID
    if (accountData) {
      res.render("account/update-account", {
        title: "Update Account Information",
        nav,
        account: accountData, // Pass account data to the view
        notice: req.flash("notice"), // Flash message
        errors: null,
      });
    } else {
      req.flash("notice", "Account not found.");
      res.redirect("/account");
    }
  } catch (error) {
    console.error("Error rendering update account view:", error);
    req.flash("notice", "An error occurred. Please try again.");
    res.redirect("/account");
  }
}

/* ****************************************
 * Process update account information
 * ************************************ */
async function processUpdateAccount(req, res) {
  const nav = await utilities.getNav();
  const { account_id, account_firstname, account_lastname, account_email } = req.body;

  try {
    const updateResult = await accountModel.updateAccount(
      account_id,
      account_firstname,
      account_lastname,
      account_email
    );

    if (updateResult) {
      req.flash("notice", "Account updated successfully.");
      res.redirect("/account");
    } else {
      req.flash("notice", "Update failed. Please try again.");
      res.status(400).render("account/update", {
        title: "Update Account Information",
        nav,
        account: req.body, // Re-populate fields after failure
        notice: req.flash("notice"),
        errors: null,
      });
    }
  } catch (error) {
    console.error("Error processing account update:", error);
    req.flash("notice", "An unexpected error occurred. Please try again.");
    res.status(500).render("account/update", {
      title: "Update Account Information",
      nav,
      account: req.body, // Re-populate fields after failure
      notice: req.flash("notice"),
      errors: null,
    });
  }
}

/* ****************************************
 * Process password update
 * ************************************ */
async function processUpdatePassword(req, res) {
  const { account_id, new_password } = req.body;
  const nav = await utilities.getNav();

  try {
    const hashedPassword = await bcrypt.hash(new_password, 10); // Hash new password
    const updateResult = await accountModel.updatePassword(account_id, hashedPassword);

    if (updateResult) {
      req.flash("notice", "Password updated successfully.");
      res.redirect("/account");
    } else {
      req.flash("notice", "Password update failed. Please try again.");
      res.status(400).render("account/update", {
        title: "Update Account Information",
        nav,
        account: req.body, // Preserve sticky data
        notice: req.flash("notice"),
        errors: null,
      });
    }
  } catch (error) {
    console.error("Error processing password update:", error);
    req.flash("notice", "An unexpected error occurred. Please try again.");
    res.status(500).render("account/update", {
      title: "Update Account Information",
      nav,
      account: req.body, // Preserve sticky data
      notice: req.flash("notice"),
      errors: null,
    });
  }
}

/* ****************************************
 * Deliver registration view
 * ************************************ */
async function accountRegisterView(req, res) {
  const nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
    notice: req.flash("notice"), // Pass the 'notice' variable to the view
    account_firstname: "",
    account_lastname: "",
    account_email: "",
  });
}

/* ****************************************
 * Process registration request
 * ************************************ */
async function accountRegister(req, res) {
  const { account_firstname, account_lastname, account_email, account_password } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(account_password, 10);

    // Create a new account in the database
    const registrationSuccess = await accountModel.createAccount({
      firstname: account_firstname,
      lastname: account_lastname,
      email: account_email,
      password: hashedPassword,
    });

    if (registrationSuccess) {
      req.flash("notice", "Account created successfully! Please log in.");
      return res.redirect("/account/login");
    } else {
      req.flash("notice", "Registration failed. Please try again.");
      res.status(500).render("account/register", {
        title: "Register",
        nav: await utilities.getNav(),
        errors: null,
        notice: req.flash("notice"), // Pass the 'notice' variable to the view
        account_firstname,
        account_lastname,
        account_email,
      });
    }
  } catch (error) {
    console.error("Error during registration process:", error);
    req.flash("notice", "An unexpected error occurred. Please try again.");
    res.status(500).render("account/register", {
      title: "Register",
      nav: await utilities.getNav(),
      errors: null,
      notice: req.flash("notice"), // Pass the 'notice' variable to the view
      account_firstname,
      account_lastname,
      account_email,
    });
  }
}

/* ****************************************
 * Export Controller Functions
 * ************************************ */
module.exports = {
  accountLoginView,
  accountLogin,
  accountManagementView,
  showUpdateAccountView,
  processUpdateAccount,
  processUpdatePassword, // New Function Added
  accountRegisterView,
  accountRegister,
};
