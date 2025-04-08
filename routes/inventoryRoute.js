const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController'); // Ensure consistent naming

// Route to display vehicle details
router.get('/detail/:inventory_id', (req, res) => {
    console.log("GET /detail/:inventory_id accessed");
    inventoryController.getVehicleDetails(req, res);
});

// Route to display the management page
router.get('/', (req, res) => {
    console.log("GET / accessed");
    inventoryController.showManagementPage(req, res);
});

// Routes for adding classifications
router.get('/add-classification', (req, res) => {
    console.log("GET /add-classification accessed");
    inventoryController.showAddClassification(req, res);
});

router.post('/add-classification', (req, res) => {
    console.log("POST /add-classification accessed");
    inventoryController.processAddClassification(req, res);
});

// Routes for adding inventory items
router.get('/add-inventory', (req, res) => {
    console.log("GET /add-inventory accessed");
    inventoryController.showAddInventory(req, res);
});

router.post('/add-inventory', (req, res) => {
    console.log("POST /add-inventory accessed");
    inventoryController.processAddInventory(req, res);
});

// Error rendering route (optional)
router.get('/error', (req, res) => {
    res.render('errors/error', { message: "An unexpected error occurred." });
});

// Fallback route for error handling
router.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error); // Pass to error-handling middleware
});

module.exports = router;
