const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController'); // Controller functions
const utilities = require('../utilities/index'); // Middleware functions

// Route to display vehicle details (Publicly accessible)
router.get('/detail/:inventory_id', (req, res) => {
    console.log("GET /detail/:inventory_id accessed");
    inventoryController.getVehicleDetails(req, res);
});

// Route to display the inventory management page (Restricted to Employee/Admin users)
router.get(
    '/',
    utilities.checkJWTToken,    // Verify JWT token
    utilities.checkAccountType, // Restrict access to Employee/Admin
    (req, res) => {
        console.log("GET / accessed");
        inventoryController.showInventoryManagementView(req, res); // Use a consistent naming convention
    }
);

// Routes for adding classifications (Restricted to Employee/Admin users)
router.get(
    '/add-classification',
    utilities.checkJWTToken,    // Verify JWT token
    utilities.checkAccountType, // Restrict access to Employee/Admin
    (req, res) => {
        console.log("GET /add-classification accessed");
        inventoryController.showAddClassificationForm(req, res); // Use consistent naming conventions
    }
);

router.post(
    '/add-classification',
    utilities.checkJWTToken,    // Verify JWT token
    utilities.checkAccountType, // Restrict access to Employee/Admin
    (req, res) => {
        console.log("POST /add-classification accessed");
        inventoryController.processAddClassification(req, res);
    }
);

// Routes for adding inventory items (Restricted to Employee/Admin users)
router.get(
    '/add-inventory',
    utilities.checkJWTToken,    // Verify JWT token
    utilities.checkAccountType, // Restrict access to Employee/Admin
    (req, res) => {
        console.log("GET /add-inventory accessed");
        inventoryController.showAddInventoryForm(req, res); // Use consistent naming conventions
    }
);

router.post(
    '/add-inventory',
    utilities.checkJWTToken,    // Verify JWT token
    utilities.checkAccountType, // Restrict access to Employee/Admin
    (req, res) => {
        console.log("POST /add-inventory accessed");
        inventoryController.processAddInventory(req, res);
    }
);

// Error rendering route (Optional: Handles specific error views)
router.get('/error', (req, res) => {
    res.render('errors/error', { message: "An unexpected error occurred." });
});

// Fallback route for handling 404 errors
router.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error); // Pass to error-handling middleware
});

// Export the router
module.exports = router;
