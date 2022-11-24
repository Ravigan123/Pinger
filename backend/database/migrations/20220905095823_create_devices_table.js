/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
	return knex.schema.createTable("devices", (table) => {
		table.charset("utf8");
		table.collate("utf8_polish_ci");
		table.increments("id").primary();
		table.integer("id_location").unsigned().notNullable();
		table
			.foreign("id_location")
			.references("locations.id")
			.onUpdate("CASCADE")
			.onDelete("CASCADE");
		table.string("name_device", 100).notNullable();
		table.string("ip_device", 20).notNullable();
		table.string("type", 20).notNullable();
		table.string("status", 6);
		table.string("message");
		table.string("params");
		table.dateTime("date_ping");
		table.dateTime("date_activity");
		table.timestamp("created_at").defaultTo(knex.raw("CURRENT_TIMESTAMP"));
		table.unique(["id"], "idx_id_devices");
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
	return knex.schema.dropTableIfExists("devices");
};
