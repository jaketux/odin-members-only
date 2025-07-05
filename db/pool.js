require("dotenv").config();

const environment = process.env.NODE_ENV || "development";

const { Pool } = require("pg");

module.exports = new Pool({
  ...(process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL }
    : {
        host: process.env.DB_HOST,
        user: process.env.DB_USERNAME,
        database: process.env.DB_USED,
        password: process.env.DB_PASSWORD,
        port: 5432,
      }),
});
