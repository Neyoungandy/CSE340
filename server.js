/* ******************************************
* This server.js file is the primary file of the 
* application. It is used to control the project.
*******************************************/

/* ***********************
* Require Statements
*************************/
const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const db = require('./database/db'); // Import the database connection
const cookieParser = require("cookie-parser")

// Load environment variables
dotenv.config();

const app = express();
const staticRoutes = require("./routes/static");
const inventoryRoutes = require("./routes/inventoryRoute");
const accountRoutes = require("./routes/accountRoute"); // Import Account Routes
console.log("Account routes successfully imported."); // Debugging statement
const errorHandler = require("./middleware/errorhandler"); // Error handling middleware

/* ***********************
* Middleware Setup
*************************/
// Cookie Parser
app.use(cookieParser());

// Session and Flash Middleware
const session = require("express-session");
const flash = require("connect-flash");

app.use(
    session({
        secret: "yourSecretKey", // Use a secure secret
        resave: false,
        saveUninitialized: true,
    })
);
app.use(flash());

// Middleware to handle JSON and form data (optional if required)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (CSS, JS, Images) but disable serving index.html
app.use(express.static(path.join(__dirname, "public"), { index: false }));

  /* ***********************
* View Engine Setup
*************************/
// Set EJS as the templating engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


/* ***********************
* Routes
*************************/
// Ensure the root ("/") route renders index.ejs
app.get("/", (req, res) => {
  res.render("index", { title: "Welcome to My Website" });
});
app.get("/custom", (req, res) => {
  res.render("custom", { title: "Custom Page" });
});
app.get("/sedan", (req, res) => {
  res.render("sedan", { title: "Sedan Page" });
});
app.get("/suv", (req, res) => {
  res.render("suv", { title: "SUV Page" });
});
app.get("/truck", (req, res) => {
  res.render("truck", { title: "Truck Page" });
});

// Use additional route files
app.use(staticRoutes);

// Inventory Routes
app.use("/inv", inventoryRoutes);

// Account Routes (handles /account/login and /account/register)
app.use("/account", accountRoutes);

/* ***********************
* 404 Error Handler
*************************/
// ⚠️ This must come AFTER all valid routes
app.use((req, res) => {
  res.status(404).render("404", { title: "Page Not Found" });
});

/* ***********************
* Error Handling Middleware
*************************/
app.use(errorHandler);

/* ***********************
* Test Database Connection
*************************/
db.query("SELECT NOW()", [])
  .then(res => console.log("Database connected at:", res.rows[0].now))
  .catch(err => console.error("Database connection error:", err));

/* ***********************
* Server Configuration
*************************/
const PORT = process.env.PORT || 5500;
const HOST = process.env.HOST || "0.0.0.0";

/* ***********************
* Start Server
*************************/
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://${HOST}:${PORT}`);
});
