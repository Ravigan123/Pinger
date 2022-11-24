const { Model } = require("objection");
const knex = require("../config/database");
const Device = require("./Device");
const Client = require("./Client");
Model.knex(knex);

class Location extends Model {
	static tableName = "locations";

	static relationMappings = {
		device: {
			relation: Model.HasManyRelation,
			modelClass: Device,
			join: {
				from: "locations.id",
				to: "devices.id_location",
			},
		},
	};

	static relationMappings = {
		client: {
			relation: Model.HasManyRelation,
			modelClass: Client,
			join: {
				from: "locations.id",
				to: "clients.id_location",
			},
		},
	};
}

module.exports = Location;
