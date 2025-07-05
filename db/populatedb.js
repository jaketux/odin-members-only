require("dotenv").config();

const environment = process.env.NODE_ENV || "development";

const { Client } = require("pg");

const SQL = `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    username VARCHAR (255), 
    first_name VARCHAR (255), 
    last_name VARCHAR (255), 
    member_status BOOLEAN NOT NULL DEFAULT FALSE, 
    admin BOOLEAN
    );


    CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    message VARCHAR (255), 
    time VARCHAR (255), 
    user_id INT REFERENCES users(id)
    );`;

async function main() {
  console.log("creating db");
  const client = new Client({
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
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done!");
}

main()
  .then(() => {
    console.log("Seeding script completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Seeding script failed: ", error);
    process.exit(1);
  });
