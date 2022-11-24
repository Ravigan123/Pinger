const { Model } = require("objection");
require("objection");
const knex = require("../config/database");
const ClientDevice = require("./ClientDevice");
Model.knex(knex);

class Client extends Model {
	static tableName = "clients";

	static relationMappings = {
		client_devices: {
			relation: Model.HasManyRelation,
			modelClass: ClientDevice,
			join: {
				from: "clients.id",
				to: "client_devices.id_device",
			},
		},
	};
}

module.exports = Client;
