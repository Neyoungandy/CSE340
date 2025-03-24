const inventoryModel = require('../models/inventoryModel');
const utilities = require('../utilities/index');

const getVehicleDetails = async (req, res, next) => {
    try {
        const { inventory_id } = req.params;
        const vehicleData = await inventoryModel.getVehicleById(inventory_id);

        if (!vehicleData) {
            return res.status(404).render('errors/404', { message: "Vehicle not found" });
        }

        const vehicleHTML = utilities.buildVehicleHTML(vehicleData);

        res.render('inventory/detail', {
            title: `${vehicleData.make} ${vehicleData.model}`,
            vehicleHTML,
        });
    } catch (error) {
        next(error); // Passes the error to the middleware
    }
};

module.exports = { getVehicleDetails };
