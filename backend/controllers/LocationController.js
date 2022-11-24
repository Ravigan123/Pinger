const Location = require("../models/Location");
const Device = require("../models/Device");

class LocationController {
	async getAllLocations(req, res) {
		try {
			const location = await Location.query()
				.select("id", "hash_location", "name_location", "ip_location")
				.orderBy("name_location");
			return res.status(200).json(location);
		} catch (err) {
			return res.status(422).json({ status: "ERR", message: err.message });
		}
	}

	async getLocationsToSelect(req, res) {
		try {
			const location = await Location.query()
				.select("id", "name_location")
				.orderBy("name_location");
			res.status(200).json(location);
		} catch (err) {
			return res.status(422).json({ status: "ERR", message: err.message });
		}
	}

	async getLocationToDashboard(req, res) {
		try {
			const { id } = req.params;

			const device = await Location.query()
				.select("locations.id")
				.count("devices.id as dev_err")
				.innerJoin("devices", "locations.id", "devices.id_location")
				.where("status", "ERR")
				.groupBy("locations.name_location");

			const location = await Location.query()
				.select(
					"locations.id",
					"locations.name_location",
					"locations.ip_location"
				)
				.count("devices.id as dev_all")
				.leftJoin("devices", "locations.id", "devices.id_location")
				.groupBy("locations.name_location")
				.orderBy("locations.name_location");

			for (const loc of location) {
				for (const dev of device) {
					if (loc["id"] === dev["id"]) loc.dev_err = dev["dev_err"];
				}
			}

			res.status(200).json(location);
		} catch (err) {
			return res.status(422).json({ status: "ERR", message: err.message });
		}
	}

	async storeLocation(req, res) {
		try {
			const { name_location, hash_location, ip_location } = req.body;
			const parsedName = name_location
				.normalize("NFD")
				.replace(/[\u0300-\u036f]/g, "");
			const location = await Location.query()
				.select("name_location", "hash_location")
				.where("name_location", parsedName)
				.orWhere("hash_location", hash_location);

			if (location.length !== 0) {
				if (location[0]["name_location"] === parsedName)
					return res.status(422).json({
						status: "ERR",
						message: "The given name already exists",
					});

				if (location[0]["hash_location"] === hash_location)
					return res.status(422).json({
						status: "ERR",
						message: "The given hash already exists",
					});
			}

			const newLocation = await Location.query().insert({
				name_location: parsedName,
				hash_location,
				ip_location,
			});
		} catch (err) {
			return res.status(422).json({ status: "ERR", message: err.message });
		}

		return res.status(201).json({ status: "OK" });
	}

	async updateLocation(req, res) {
		try {
			const { name_location, hash_location, ip_location } = req.body;
			const { id } = req.params;
			const parsedName = name_location
				.normalize("NFD")
				.replace(/[\u0300-\u036f]/g, "");
			if (req.body["changedName"] === true) {
				const locationFind = await Location.query()
					.select("name_location")
					.where("name_location", parsedName);

				if (locationFind.length !== 0) {
					if (locationFind[0]["name_location"] === parsedName)
						return res.status(422).json({
							status: "ERR",
							message: "The given name already exists",
						});
				}
			}

			if (req.body["changedHash"] === true) {
				const locationHash = await Location.query()
					.select("hash_location")
					.where("hash_location", hash_location);

				if (locationHash.length !== 0) {
					if (locationHash[0]["hash_location"] === hash_location)
						return res.status(422).json({
							status: "ERR",
							message: "The given hash already exists",
						});
				}
			}

			const location = await Location.query()
				.findById(id)
				.patch({ name_location: parsedName, hash_location, ip_location });
		} catch (err) {
			return res.status(422).json({ status: "ERR", message: err.message });
		}

		return res.status(201).json({ status: "OK" });
	}

	async deleteLocation(req, res) {
		try {
			const { id } = req.params;
			const location = await Location.query().deleteById(id);
			return res.status(204).json({ status: "OK" });
		} catch (err) {
			return res.status(422).json({ status: "ERR", message: err.message });
		}
	}
}

module.exports = new LocationController();
