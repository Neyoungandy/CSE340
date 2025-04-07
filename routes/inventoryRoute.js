const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController'); // Ensure consistent naming

// Route to display vehicle details
router.get('/detail/:inventory_id', inventoryController.getVehicleDetails);

// Route to display the management page
router.get('/', inventoryController.showManagementPage);

// Routes for adding classifications
router.get('/add-classification', inventoryController.showAddClassification);
router.post('/add-classification', inventoryController.processAddClassification);

// Routes for adding inventory items
router.get('/add-inventory', inventoryController.showAddInventory);
router.post('/add-inventory', inventoryController.processAddInventory);

// Fallback route for error handling
router.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error); // Pass to error-handling middleware
});

module.exports = router;
