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
const db = require("./db"); // Import the database connection

// Load environment variables
dotenv.config();

const app = express();
const staticRoutes = require("./routes/static");
const errorHandler = require("./middleware/errorhandler"); // Error handling middleware

/* ***********************
* View Engine Setup
*************************/
// Set EJS as the templating engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // Ensure views folder is correctly set

/* ***********************
* Middleware & Static Files
*************************/

// Serve static files (CSS, JS, Images) but disable serving index.html
app.use(
  express.static(path.join(__dirname, "public"), { index: false }) // 👈 Prevents auto-loading of index.html
);

// Use routes before defining other dynamic routes
app.use(staticRoutes);

/* ***********************
* Routes
*************************/

// Ensure the root ("/") route renders index.ejs
app.get("/", (req, res) => {
  res.render("index", { title: "Welcome to My Website" });
});

app.get("/custom", (req, res) => {
  res.render("custom");
});

app.get("/sedan", (req, res) => {
  res.render("sedan");
});

app.get("/suv", (req, res) => {
  res.render("suv");
});

app.get("/truck", (req, res) => {
  res.render("truck");
});

/* ***********************
* Test Database Connection
*************************/
db.query("SELECT NOW()")
  .then((result) => {
    console.log("🚀 Database connected at:", result.rows[0].now);
  })
  .catch((err) => {
    console.error("❌ Database connection error:", err.message);
  });

/* ***********************
* Error Handling Middleware
*************************/
// Place error handler at the end to catch errors
app.use(errorHandler);

/* ***********************
* Server Configuration
*************************/
const PORT = process.env.PORT || 5500; // Default to 5500 if PORT is not set
const HOST = process.env.HOST || "0.0.0.0"; // Use 0.0.0.0 to work on Render

/* ***********************
* Start Server
*************************/
app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running at http://${HOST}:${PORT}`);
});
