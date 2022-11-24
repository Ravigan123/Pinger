/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
	return knex.schema.createTable("locations", (table) => {
		table.charset('utf8');
		table.collate('utf8_polish_ci');
		table.increments("id").primary();
		table.string("hash_location", 40).notNullable().unique();
		table.string("name_location", 30).notNullable();
		table.string("ip_location", 20).notNullable();
		table.timestamp("created_at").defaultTo(knex.raw("CURRENT_TIMESTAMP"));
		table
			.timestamp("updated_at")
			.defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
		table.unique(["id"], "idx_id_locations");
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
	return knex.schema.dropTableIfExists("locations");
};
