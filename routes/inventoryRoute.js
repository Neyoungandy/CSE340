const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

// Route to display vehicle details
router.get('/detail/:inventory_id', inventoryController.getVehicleDetails);

router.get('/', invController.showManagementPage);
router.get('/classification', invController.showClassification);
router.post('/classification', invController.processClassification);
router.get('/add-inventory', invController.showAddInventory);
router.post('/add-inventory', invController.processAddInventory);


module.exports = router;
