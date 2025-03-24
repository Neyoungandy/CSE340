const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

// Route to display vehicle details
router.get('/detail/:inventory_id', inventoryController.getVehicleDetails);

module.exports = router;
