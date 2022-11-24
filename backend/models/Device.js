const { Model } = require("objection");
require("objection");
const knex = require("../config/database");
const ClientDevice = require("./ClientDevice");
Model.knex(knex);

class Device extends Model {
	static tableName = "devices";

	static relationMappings = {
		client_devices: {
			relation: Model.HasManyRelation,
			modelClass: ClientDevice,
			join: {
				from: "devices.id",
				to: "client_devices.id_device",
			},
		},
	};
}

module.exports = Device;
