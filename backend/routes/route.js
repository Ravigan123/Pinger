const express = require("express");
const router = express.Router();
const ClientController = require("../controllers/ClientController");
const DeviceController = require("../controllers/DeviceController");
const LocationController = require("../controllers/LocationController");
const ClientDeviceController = require("../controllers/ClientDeviceController");

// router.get("/data", DataController.getAllData);
// router.get("/store", DataController.translateData);
// router.delete("/:id", DataController.deleteData);

// router.get("/client-device", ClientDeviceController.getAllClientDevices);
// router.get(
// 	"/client-deviceSelect",
// 	ClientDeviceController.getClientDeviceToSelect
// );

router.get("/client/device/:id", ClientDeviceController.getLocationsAndDevices);
router.post("/client-device", ClientDeviceController.storeClientDevice);
router.delete("/client-device/:id", ClientDeviceController.deleteClientDevice);

// router.put("/client-device/:id", ClientDeviceController.updateClientDevice);
// router.delete("/client-device/:id", ClientDeviceController.deleteClientDevice);

router.get("/device", DeviceController.getAllDevices);
router.get("/deviceSelect", DeviceController.getDevicesToSelect);
router.post("/device/", DeviceController.storeDevice);
router.post("/device-many/", DeviceController.storeManyDevice);
router.post("/device-data", DeviceController.updateData);
router.put("/device/:id", DeviceController.updateDevice);
router.delete("/device/:id", DeviceController.deleteDevice);

router.get("/client", ClientController.getAllClients);
router.get("/clientSelect", ClientController.getClientsToSelect);
router.get("/location-client/:id", ClientController.getClientsInLocation);
router.get("/location-device/:id", DeviceController.getDevicesInLocation);
router.get("/client-device/:id", DeviceController.getDevicesToClient);
router.post("/client/", ClientController.storeClient);
router.post("/client-register/", ClientController.registerClient);
router.get("/client-config", ClientController.getConfig);
router.put("/client/:id", ClientController.updateClient);
router.delete("/client/:id", ClientController.deleteClient);

router.get("/location", LocationController.getAllLocations);
router.get("/location-dashboard", LocationController.getLocationToDashboard);
router.get("/getLocationSelect", LocationController.getLocationsToSelect);
router.post("/location/", LocationController.storeLocation);
router.put("/location/:id", LocationController.updateLocation);
router.delete("/location/:id", LocationController.deleteLocation);

module.exports = router;
