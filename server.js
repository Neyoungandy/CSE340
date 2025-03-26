/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const session = require("express-session")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")

/* ***********************
 * Middleware
 * ************************/
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

// Use body parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Use cookie parser
app.use(cookieParser())

// Remove JWT token validation if it's not needed
// app.use(utilities.checkJWTToken)

/* ***********************
 * View Engine and Template
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")

/* ***********************
 * Routes
 *************************/
// static route
app.use(require("./routes/static"))

// inventory route
app.use("/inv", require("./routes/inventoryRoute"))

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({
    status: 404, 
    message: 'This is not the page you are looking for... Go about your business... Move along...'
  })
})

/* ***********************
 * Express Error Handler
 *************************/
app.use(async (err, req, res, next) => {
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  const message = err.status == 404 ? err.message : 'Oops, something went wrong! Try a different route?'
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
  })
})

/* ***********************
 * Local Server Information
 *************************/
const port = process.env.PORT || 3000
const host = process.env.HOST || 'localhost'

/* ***********************
 * Start Server
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})

// Error handling middleware
const errorHandler = require('./middleware/errorhandler');
app.use(errorHandler);
