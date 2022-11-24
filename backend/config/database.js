const knex = require("knex");
const knexfile = require("../knexfile");

const env = process.env.NODE_ENV || "development";
require("dotenv").config();

module.exports = knex(knexfile[env]);
// const mariadb = require("mariadb/callback");
// const conn = mariadb.createConnection({
// 	host: process.env.DB_HOST,
// 	port: process.env.DB_PORT,
// 	user: process.env.DB_USER,
// 	password: process.env.DB_PASSWORD,
// 	database: process.env.DB_NAME,
// });
// conn.query("SELECT * from types", (err, rows) => {
// 	console.log(rows); //[ {val: 1}, meta: ... ]
// });
// module.exports = conn;
