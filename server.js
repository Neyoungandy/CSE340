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
const db = require('./db'); // Import the database connection

// Load environment variables
dotenv.config();

const app = express();
const staticRoutes = require("./routes/static");
const errorHandler = require("./middleware/errorhandler"); // Error handling middleware

/* ***********************
* View Engine Setup
*************************/
//  Set EJS as the templating engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // Ensure views folder is correctly set

/* ***********************
* Middleware & Static Files
*************************/

//  Serve static files (CSS, JS, Images) but disable serving index.html
app.use(
  express.static(path.join(__dirname, "public"), { index: false }) // 👈 Prevents auto-loading of index.html
);

// 404 error handler (must be last)
app.use((req, res) => {
  res.status(404).render("404", { title: "Page Not Found" });
});


//  Ensure the root ("/") route renders index.ejs
app.get("/", (req, res) => {
  res.render("index", { title: "Welcome to My Website" });
});
app.get('/custom', (req, res) => {
  res.render('custom');
});

app.get('/sedan', (req, res) => {
  res.render('sedan');
});

app.get('/suv', (req, res) => {
  res.render('suv');
});

app.get('/truck', (req, res) => {
  res.render('truck');
});
//  Use routes
app.use(staticRoutes);

// Test database connection
db.query('SELECT NOW()', [])
  .then(res => console.log('Database connected at:', res.rows[0].now))
  .catch(err => console.error('Database connection error:', err));

/* ***********************
* Error Handling Middleware
*************************/
//  Place error handler at the end to catch errors
app.use(errorHandler);

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


