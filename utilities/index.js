const db = require("../database/db"); // Import the database connection

exports.buildVehicleHTML = (vehicle) => {
  // Use fallback values to ensure safe rendering
  const vehicleImage = vehicle.image || "/images/default-vehicle.png"; // Fallback for missing image
  const vehiclePrice = vehicle.price ? `$${parseFloat(vehicle.price).toLocaleString()}` : "Price not available";
  const vehicleMileage = vehicle.mileage ? `${parseInt(vehicle.mileage).toLocaleString()} miles` : "Mileage not available";
  const vehicleColor = vehicle.color || "Color not specified";
  const vehicleFuelType = vehicle.fuel_type || "Fuel type not specified";
  const vehicleTransmission = vehicle.transmission || "Transmission not specified";

  // Return the HTML structure
  return `
    <div class="vehicle-detail">
      <h1>${vehicle.year || "Year not specified"} ${vehicle.make || "Make not specified"} ${vehicle.model || "Model not specified"}</h1>
      <img class="vehicle-image" src="${vehicleImage}" alt="${vehicle.make || "Vehicle"} ${vehicle.model || "Details"}">
      <p><strong>Price:</strong> ${vehiclePrice}</p>
      <p><strong>Mileage:</strong> ${vehicleMileage}</p>
      <p><strong>Color:</strong> ${vehicleColor}</p>
      <p><strong>Fuel Type:</strong> ${vehicleFuelType}</p>
      <p><strong>Transmission:</strong> ${vehicleTransmission}</p>
    </div>
  `;
};

// Fetch classifications from the database
exports.buildClassificationList = async () => {
  try {
    const result = await db.query("SELECT * FROM classification ORDER BY classification_name ASC");
    return result.rows; // Return the rows as an array
  } catch (error) {
    console.error("Error fetching classifications:", error.message);
    throw error; // Ensure the error propagates to the calling function
  }
};
