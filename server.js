/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const dotenv = require("dotenv");

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

// ✅ Set the directory for EJS views
app.set("views", __dirname + "/views");

/* ***********************
 * Middleware & Static Files
 *************************/

// ✅ Serve static files (CSS, JS, Images) from public folder
app.use(express.static("public"));

// ✅ Use routes
app.use(staticRoutes);

// ✅ Error handling middleware
app.use(errorHandler);

/* ***********************
 * Homepage Route (Render index.ejs)
 *************************/
app.get("/", (req, res) => {
  res.render("index", { title: "Welcome to My Website" });
});

/* ***********************
 * Server Configuration
 *************************/
const PORT = process.env.PORT || 5500; // Default to 5500 if PORT is not set
const HOST = process.env.HOST || "localhost"; // Default to localhost if HOST is not set;

/* ***********************
 * Start Server
 *************************/
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://${HOST}:${PORT}`);
});
