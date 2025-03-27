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

// Load environment variables
dotenv.config();

const app = express();
const staticRoutes = require("./routes/static");
const errorHandler = require("./middleware/errorhandler"); // Error handling middleware

/* ***********************
* View Engine Setup
*************************/
// ✅ Set EJS as the templating engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // Ensure views folder is correctly set

/* ***********************
* Middleware & Static Files
*************************/

// ✅ Serve static files (CSS, JS, Images)
app.use(express.static(path.join(__dirname, "public"))); 

// ✅ Use routes
app.use(staticRoutes);

// ✅ Error handling middleware
app.use(errorHandler);

/* ***********************
* Homepage Route
*************************/
// ✅ Ensure the root ("/") route renders index.ejs
app.get("/", (req, res) => {
  res.render("index", { title: "Welcome to My Website" });
});

/* ***********************
* Server Configuration
*************************/
const PORT = process.env.PORT || 5500; // Default to 5500 if PORT is not set
const HOST = process.env.HOST || "0.0.0.0"; // Use 0.0.0.0 to work on Render

/* ***********************
* Start Server
*************************/
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://${HOST}:${PORT}`);
});
