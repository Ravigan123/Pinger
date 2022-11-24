const ClientDevice = require("../models/ClientDevice");
const Location = require("../models/Location");
const Device = require("../models/Device");

class ClientDeviceController {
	async getAllData(req, res) {
		try {
			const dataQuery = await Data.query().select("*").orderBy("status");
			res.status(200).json(dataQuery);
		} catch (error) {
			res.status(401).json(error);
		}
	}

	async getLocationsAndDevices(req, res) {
		try {
			const { id } = req.params;

			const location = await Location.query()
				.select("locations.id", "name_location")
				.innerJoin("clients", "locations.id", "clients.id_location")
				.where("clients.id", id);

			const id_location = location[0]["id"];

			const devices = await Device.query()
				.select("devices.id")
				.innerJoin("locations", "locations.id", "devices.id_location")
				.where("devices.id_location", id_location);

			let devicesAll = [];
			devices.forEach((el) => {
				devicesAll.push(el["id"]);
			});

			const devicesIn = await Device.query()
				.select("devices.id", "name_device")
				.innerJoin("client_devices", "devices.id", "client_devices.id_device")
				.innerJoin("clients", "clients.id", "client_devices.id_client")
				.where("devices.id_location", id_location)
				.where("client_devices.id_client", id);

			let devicesIn1 = [];
			devicesIn.forEach((el) => {
				devicesIn1.push(el["id"]);
			});

			const devicesApart = await Device.query()
				.select("devices.id", "name_device")
				.whereNotIn("devices.id", devicesIn1)
				.where("devices.id_location", id_location);

			res.status(200).json(devicesApart);
		} catch (err) {
			return res.status(422).json({ status: "ERR", message: err.message });
		}
	}

	async storeClientDevice(req, res) {
		try {
			for (const el of req.body) {
				const id_client = el["id_client"];
				const id_device = el["id_device"];
				const newClientDevice = await ClientDevice.query().insert({
					id_client,
					id_device,
				});
			}
			return res.status(201).json({ status: "OK" });
		} catch (err) {
			return res.status(422).json({ status: "ERR", message: err.message });
		}
	}

	async deleteClientDevice(req, res) {
		try {
			const { id } = req.params;
			const clientDevice = await ClientDevice.query().deleteById(id);
			return res.status(204).json({ status: "OK" });
		} catch (err) {
			return res.status(422).json({ status: "ERR", message: err.message });
		}
	}
}

module.exports = new ClientDeviceController();
