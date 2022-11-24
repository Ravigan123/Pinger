const Client = require("../models/Client");
const Device = require("../models/Device");
const Location = require("../models/Location");
const ClientDevice = require("../models/ClientDevice");
const randomstring = require("randomstring");

class ClientController {
	async getAllClients(req, res) {
		try {
			const client = await Client.query()
				.select(
					"clients.id",
					"id_location",
					"hash_client",
					"name_client",
					"ip_client",
					"config",
					"params",
					"date_config",
					"locations.name_location"
				)
				.innerJoin("locations", "locations.id", "clients.id_location")
				.orderBy("name_location", "name_client");
			res.status(200).json(client);
		} catch (err) {
			res.status(422).json(err);
		}
	}

	async getClientsInLocation(req, res) {
		try {
			const { id } = req.params;
			const client = await Client.query()
				.select(
					"clients.id",
					"clients.name_client",
					"clients.ip_client",
					"clients.config",
					"clients.date_config",
					"clients.params",
					"clients.id_location",
					"locations.name_location"
				)
				.innerJoin("locations", "locations.id", "clients.id_location")
				.where("clients.id_location", id);
			res.status(200).json(client);
		} catch (err) {
			return res.status(422).json({ status: "ERR", message: err.message });
		}
	}

	async getClientsToSelect(req, res) {
		try {
			const client = await Client.query().select("id", "name_client");
			res.status(200).json(client);
		} catch (err) {
			return res.status(422).json({ message: err.message });
		}
	}

	async getConfig(req, res) {
		if (typeof req.body.hash == "undefined")
			return res.status(422).json({ status: "ERR", message: "not registered" });
		try {
			const { hash, params } = req.body;

			const type = params[0]["sendConfig"];

			const client = await Client.query()
				.select("id", "config")
				.where("hash_client", hash);

			if (client.length === 0)
				return res
					.status(422)
					.json({ status: "ERR", message: "not registered" });

			if (type === "new") {
				const flag = client[0]["config"];

				if (flag === 1) {
					return res
						.status(200)
						.json({ hash, status: "INFO", message: "current config" });
				}
			}

			const location = await Location.query()
				.select("locations.id", "name_location", "hash_location")
				.innerJoin("clients", "locations.id", "clients.id_location")
				.where("hash_client", hash);

			const id_client = client[0]["id"];

			const device = await Device.query()
				.select("devices.ip_device", "devices.type", "devices.params")
				.innerJoin("client_devices", "devices.id", "client_devices.id_device")
				.innerJoin("clients", "clients.id", "client_devices.id_client")
				.where("client_devices.id_client", id_client);

			let data = [];

			let config = new Object();
			config["location"] = location[0]["hash_location"];
			config["name"] = location[0]["name_location"];
			config["date"] = new Date().toLocaleString("se-SE", {
				timeZone: "Europe/Warsaw",
			});
			config["IPS"] = [];

			for (const dev of device) {
				let newDev = new Object();

				newDev["ip"] = dev["ip_device"];
				newDev["type"] = dev["type"];
				newDev["params"] = dev["params"];
				config["IPS"].push(newDev);
			}

			data.push(config);

			const date_config = new Date();

			const clientUpdate = await Client.query()
				.where("hash_client", hash)
				.patch({
					config: 1,
					date_config,
				});

			return res.status(200).json({ hash, status: "OK", data });
		} catch (err) {
			return res.status(422).json({ status: "ERR", message: err.message });
		}
	}

	async storeClient(req, res) {
		try {
			const { name_client, ip_client, params, enabled } = req.body;

			const parsedName = name_client
				.normalize("NFD")
				.replace(/[\u0300-\u036f]/g, "");
			const client = await Client.query()
				.count("id")
				.where("name_client", parsedName);

			if (client[0]["count(`id`)"] !== 0)
				return res.status(422).json({
					status: "ERR",
					message: "The given client already exists",
				});

			const id_location = parseInt(req.body.id_location);
			const date_config = new Date();
			const newClient = await Client.query().insert({
				id_location,
				hash_client: null,
				name_client: parsedName,
				ip_client,
				config: enabled,
				params,
				date_config,
			});
		} catch (err) {
			return res.status(422).json({ status: "ERR", message: err.message });
		}
		return res.status(201).json({ status: "OK" });
	}

	async registerClient(req, res) {
		let data = {};
		try {
			const { location, name } = req.body;

			const client = await Client.query()
				.select("clients.id", "clients.hash_client", "locations.name_location")
				.innerJoin("locations", "locations.id", "clients.id_location")
				.where("locations.name_location", location)
				.where("name_client", name);

			if (client.length === 0)
				return res.status(422).json({
					status: "ERR",
					message: "The given client not exists",
				});

			if (client[0]["hash_client"] !== null)
				return res.status(422).json({
					status: "ERR",
					message: "The given client is already registered",
				});

			const id = client[0]["id"];
			const hash_client = randomstring.generate(32);

			const clientUpdate = await Client.query().findById(id).patch({
				hash_client,
			});

			data = { hash: hash_client, location, name, id };
		} catch (err) {
			return res.status(422).json({ status: "ERR", message: err.message });
		}
		return res.status(201).json({ status: "OK", data });
	}

	async updateClient(req, res) {
		try {
			const {
				name_client,
				ip_client,
				config,
				params,
				changedName,
				changedLocation,
			} = req.body;
			const id_location = parseInt(req.body.id_location);
			const { id } = req.params;
			const parsedName = name_client
				.normalize("NFD")
				.replace(/[\u0300-\u036f]/g, "");
			if (req.body["changedName"] === true) {
				const clientFind = await Client.query()
					.where("name_client", parsedName)
					.where("id_location", id_location);
				if (clientFind.length !== 0) {
					if (clientFind[0]["name_client"] === parsedName)
						return res.status(422).json({
							status: "ERR",
							message: "The given name already exists",
						});
				}
			}

			const date_config = new Date();

			const client = await Client.query().findById(id).patch({
				id_location,
				name_client: parsedName,
				ip_client,
				config,
				params,
				date_config,
			});

			if (changedLocation === true) {
				const deleteClientDevice = await ClientDevice.query()
					.delete()
					.where("id_client", id);
			}

			return res.status(204).json({ status: "OK" });
		} catch (err) {
			return res.status(422).json({ status: "ERR", message: err.message });
		}
		return res.status(201).json({ status: "OK" });
	}

	async deleteClient(req, res) {
		try {
			const { id } = req.params;
			const client = await Client.query().deleteById(id);
			return res.status(204).json({ status: "OK" });
		} catch (err) {
			return res.status(422).json({ status: "ERR", message: err.message });
		}
	}
}

module.exports = new ClientController();
