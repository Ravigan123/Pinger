const Device = require("../models/Device");
const Location = require("../models/Location");
const Client = require("../models/Client");
const ClientDevice = require("../models/ClientDevice");

class DeviceController {
	async getAllDevices(req, res) {
		try {
			const device = await Device.query()
				.select(
					"status",
					"devices.id",
					"name_device",
					"ip_device",
					"type",
					"date_ping",
					"date_activity",
					"message",
					"params",
					"id_location",
					"locations.name_location"
				)
				.innerJoin("locations", "locations.id", "devices.id_location")
				.orderBy("name_location", "name_device");

			res.status(200).json(device);
		} catch (err) {
			return res.status(422).json({ status: "ERR", message: err.message });
		}
	}

	async getDevicesInLocation(req, res) {
		try {
			const { id } = req.params;
			const device = await Device.query()
				.select(
					"devices.status",
					"devices.id",
					"devices.name_device",
					"devices.ip_device",
					"devices.type",
					"devices.date_ping",
					"devices.date_activity",
					"devices.message",
					"devices.params",
					"devices.id_location",
					"locations.name_location"
				)
				.innerJoin("locations", "locations.id", "devices.id_location")
				.where("devices.id_location", id)
				.orderBy("devices.name_device");
			res.status(200).json(device);
		} catch (err) {
			return res.status(422).json({ status: "ERR", message: err.message });
		}
	}

	async getDevicesToClient(req, res) {
		try {
			const { id } = req.params;
			const device = await Device.query()
				.select(
					"devices.status",
					"devices.name_device",
					"devices.ip_device",
					"devices.type",
					"devices.date_ping",
					"devices.date_activity",
					"devices.message",
					"devices.params",
					"client_devices.id"
				)
				.innerJoin("client_devices", "devices.id", "client_devices.id_device")
				.innerJoin("clients", "clients.id", "client_devices.id_client")
				.where("client_devices.id_client", id)
				.orderBy("devices.name_device");
			res.status(200).json(device);
		} catch (err) {
			return res.status(422).json({ status: "ERR", message: err.message });
		}
	}

	async getDevicesToSelect(req, res) {
		try {
			const device = await Device.query().select("id", "name_device");
			res.status(200).json(device);
		} catch (err) {
			return res.status(422).json({ status: "ERR", message: err.message });
		}
	}

	async storeDevice(req, res) {
		try {
			const { id_location, name_device, ip_device, type, params } = req.body;

			const parsedName = name_device
				.normalize("NFD")
				.replace(/[\u0300-\u036f]/g, "");
			const deviceFind = await Device.query()
				.where("id_location", id_location)
				.where("name_device", parsedName);
			if (deviceFind.length !== 0)
				return res.status(422).json({
					status: "ERR",
					message: "The given device already exists",
				});

			const newDevice = await Device.query().insert({
				id_location,
				name_device: parsedName,
				ip_device,
				type,
				params,
			});
		} catch (err) {
			return res.status(422).json({ status: "ERR", message: err.message });
		}

		res.status(201).json({ status: "OK" });
	}

	async storeManyDevice(req, res) {
		try {
			const {
				id_location,
				size,
				name_pattern,
				ip_pattern,
				from,
				to,
				type,
				params,
			} = req.body;

			const parsedName = name_pattern
				.normalize("NFD")
				.replace(/[\u0300-\u036f]/g, "");

			for (let i = from; i <= to; i++) {
				const iter = padLeadingZeros(i, size);
				const name_device = parsedName.replace("$", iter);
				const ip_device = ip_pattern.replace("$", iter);

				const deviceFind = await Device.query()
					.where("id_location", id_location)
					.where("name_device", name_device);
				if (deviceFind.length !== 0)
					return res.status(422).json({
						status: "ERR",
						message: "The given device already exists",
					});

				const newDevice = await Device.query().insert({
					id_location,
					name_device,
					ip_device,
					type,
					params,
				});
			}
		} catch (err) {
			return res.status(422).json({ status: "ERR", message: err.message });
		}

		res.status(201).json({ status: "OK" });
	}

	async updateData(req, res) {
		try {
			if (Object.keys(req.body).length === 0)
				return res.status(422).json({ status: "ERR", message: "No data" });

			if (typeof req.body.hash == "undefined")
				return res
					.status(422)
					.json({ status: "ERR", message: "not registered" });

			const { hash, location, name, date, IPS } = req.body;

			const client = await Client.query()
				.select("id", "config")
				.where("hash_client", hash);

			if (client.length === 0)
				return res
					.status(422)
					.json({ status: "ERR", message: "not registered" });

			const location_id = await Location.query()
				.select("id")
				.where("hash_location", location);

			if (location_id.length === 0 || typeof location === "undefined")
				return res.status(422).json({
					status: "ERR",
					message: "The given location not exists",
				});

			const id_location = location_id[0]["id"];

			const checkIPS = [];
			const checkIP = await Device.query()
				.select("ip_device")
				.where("id_location", id_location);

			for (const check of checkIP) {
				checkIPS.push(check["ip_device"]);
			}

			const tabIP = [];
			for (const ip of IPS) {
				if (!checkIPS.includes(ip["ip"])) tabIP.push(ip["ip"]);
			}

			for (const IP of IPS) {
				const status = IP["status"];
				const ip_device = IP["ip"];
				const message = IP["message"];
				const params = IP["params"];
				if (status === "OK") {
					const updatedDevice = await Device.query()
						.where("ip_device", ip_device)
						.patch({
							status,
							message: null,
							date_ping: date,
							date_activity: date,
							params,
						});
				} else {
					const updatedDevice = await Device.query()
						.where("ip_device", ip_device)
						.patch({ status, message, date_ping: date, params });
				}
			}
		} catch (err) {
			return res.status(422).json({ status: "ERR", message: err.message });
		}

		res.status(201).json({ status: "OK" });
	}

	async updateDevice(req, res) {
		try {
			const {
				id_location,
				name_device,
				ip_device,
				type,
				params,
				changedName,
				changedLocation,
			} = req.body;
			const { id } = req.params;
			const parsedName = name_device
				.normalize("NFD")
				.replace(/[\u0300-\u036f]/g, "");

			if (req.body["changedName"] === true) {
				const deviceFind = await Device.query()
					.where("name_device", parsedName)
					.where("id_location", id_location);
				if (deviceFind.length !== 0) {
					if (deviceFind[0]["name_device"] === parsedName)
						return res.status(422).json({
							status: "ERR",
							message: "The given name already exists",
						});
				}
			}
			const device = await Device.query().findById(id).patch({
				id_location,
				name_device: parsedName,
				ip_device,
				type,
				params,
			});

			if (changedLocation === true) {
				const deleteClientDevice = await ClientDevice.query()
					.delete()
					.where("id_device", id);
			}
		} catch (err) {
			return res.status(422).json({ status: "ERR", message: err.message });
		}
		return res.status(201).json({ status: "OK" });
	}

	async deleteDevice(req, res) {
		try {
			const id = req.params.id;
			const device = await Device.query().deleteById(id);
			return res.status(204).json({ status: "OK" });
		} catch (err) {
			return res.status(422).json({ status: "ERR", message: err.message });
		}
	}
}

function padLeadingZeros(num, size) {
	let s = num + "";
	while (s.length < size) s = "0" + s;
	return s;
}

module.exports = new DeviceController();
