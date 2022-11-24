const { Model } = require("objection");
require("objection");
const knex = require("../config/database");
Model.knex(knex);
const Client = require("./Client");
const Device = require("./Device");

class ClientDevice extends Model {
	static tableName = "client_devices";
}

module.exports = ClientDevice;
