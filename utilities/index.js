const db = require("../database/db"); // Import the database connection
const jwt = require("jsonwebtoken"); // Require jsonwebtoken for token operations
require("dotenv").config(); // Load environment variables from .env

/* ****************************************
 * Utility function to build vehicle HTML
 **************************************** */
exports.buildVehicleHTML = (vehicle) => {
  const vehicleImage = vehicle.image || "/images/default-vehicle.png"; // Fallback for missing image
  const vehiclePrice = vehicle.price ? `$${parseFloat(vehicle.price).toLocaleString()}` : "Price not available";
  const vehicleMileage = vehicle.mileage ? `${parseInt(vehicle.mileage).toLocaleString()} miles` : "Mileage not available";
  const vehicleColor = vehicle.color || "Color not specified";
  const vehicleFuelType = vehicle.fuel_type || "Fuel type not specified";
  const vehicleTransmission = vehicle.transmission || "Transmission not specified";

  return `
    <div class="vehicle-detail">
      <h1>${vehicle.year || "Year not specified"} ${vehicle.make || "Make not specified"} ${vehicle.model || "Model not specified"}</h1>
      <img class="vehicle-image" src="${vehicleImage}" alt="${vehicle.make || "Vehicle"} ${vehicle.model || "Details"}">
      <p><strong>Price:</strong> ${vehiclePrice}</p>
      <p><strong>Mileage:</strong> ${vehicleMileage}</p>
      <p><strong>Color:</strong> ${vehicleColor}</p>
      <p><strong>Fuel Type:</strong> ${vehicleFuelType}</p>
      <p><strong>Transmission:</strong> ${vehicleTransmission}</p>
    </div>
  `;
};

/* ****************************************
 * Fetch classifications from the database
 **************************************** */
exports.buildClassificationList = async () => {
  try {
    const result = await db.query("SELECT * FROM classification ORDER BY classification_name ASC");
    return result.rows; // Return the rows as an array
  } catch (error) {
    console.error("Error fetching classifications:", error.message);
    throw error; // Ensure the error propagates to the calling function
  }
};

/* ****************************************
 * Middleware to check token validity
 **************************************** */
exports.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt, // Extract JWT from cookies
      process.env.ACCESS_TOKEN_SECRET, // Use the secret key from .env
      function (err, decoded) {
        if (err) {
          req.flash("notice", "Please log in"); // Flash login notice
          res.clearCookie("jwt"); // Clear invalid JWT
          res.locals.loggedin = false; // Mark user as NOT logged in
          return res.redirect("/account/login"); // Redirect to login page
        }

        // Attach decoded account data to session
        req.session.accountData = {
          account_id: decoded.account_id,
          account_firstname: decoded.account_firstname,
          account_lastname: decoded.account_lastname,
          account_email: decoded.account_email,
          account_type: decoded.account_type,
        };

        // Attach account data to response object for use in templates
        res.locals.accountData = req.session.accountData; // Attach to locals
        res.locals.loggedin = true; // Mark user as logged in

        // Debug logs to ensure everything is working
        console.log("Decoded Token Data:", decoded);
        console.log("Session Data:", req.session.accountData);

        next(); // Proceed to the next middleware/function
      }
    );
  } else {
    res.locals.loggedin = false; // Mark user as NOT logged in
    next(); // If no JWT, proceed to next middleware
  }
};

/* ****************************************
 * Middleware to handle async errors
 **************************************** */
exports.handleErrors = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/* ****************************************
 * Utility function to get the navigation bar
 **************************************** */
exports.getNav = async () => {
  try {
    const result = await db.query("SELECT * FROM classification ORDER BY classification_name ASC");
    let nav = "<ul>";
    result.rows.forEach((row) => {
      nav += `<li><a href="/inv/${row.classification_id}" title="View our ${row.classification_name} inventory">${row.classification_name}</a></li>`;
    });
    nav += "</ul>";
    return nav;
  } catch (error) {
    console.error("Error generating navigation bar:", error.message);
    throw error;
  }
};

/* ****************************************
 * Check Login Middleware
 **************************************** */
exports.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next(); // If the user is logged in, proceed to the next middleware or route handler
  } else {
    req.flash("notice", "Please log in."); // Flash login notice
    return res.redirect("/account/login"); // Redirect to the login page
  }
};

/* ****************************************
 * Check Account Type Middleware
 **************************************** */
exports.checkAccountType = (req, res, next) => {
  if (
    res.locals.loggedin &&
    (res.locals.accountData.account_type === "Employee" || res.locals.accountData.account_type === "Admin")
  ) {
    next(); // Proceed if the user has Employee or Admin account type
  } else {
    req.flash("notice", "You do not have permission to access this resource.");
    return res.redirect("/account/login"); // Redirect to login page if unauthorized
  }
};
