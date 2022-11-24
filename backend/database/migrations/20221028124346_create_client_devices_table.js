/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
	return knex.schema.createTable("client_devices", (table) => {
		table.charset("utf8");
		table.collate("utf8_polish_ci");
		table.increments("id").primary();
		table.integer("id_client").unsigned().notNullable();
		table
			.foreign("id_client")
			.references("clients.id")
			.onUpdate("CASCADE")
			.onDelete("CASCADE");
		table.integer("id_device").unsigned().notNullable();
		table
			.foreign("id_device")
			.references("devices.id")
			.onUpdate("CASCADE")
			.onDelete("CASCADE");
		table.timestamp("created_at").defaultTo(knex.raw("CURRENT_TIMESTAMP"));
		table
			.timestamp("updated_at")
			.defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
		table.unique(["id"], "idx_id_client_devices");
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
	return knex.schema.dropTableIfExists("client_devices");
};
