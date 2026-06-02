const { Pool } = require('pg');
require('dotenv').config();

// Connect to Postgres using environment variables or fallbacks
const pool = new Pool({
  user: process.env.DB_USER || 'todo_user',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'todo_db',
  password: process.env.DB_PASSWORD || 'todo_password',
  port: process.env.DB_PORT || 5433,
});

// Initialize table with a retry mechanism (because Docker Postgres takes a few seconds to boot)
async function initDb(retries = 5) {
  while (retries > 0) {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS todos (
          id SERIAL PRIMARY KEY,
          text VARCHAR(255) NOT NULL,
          completed BOOLEAN DEFAULT FALSE
        );
      `);
      console.log("Database table 'todos' is ready!");
      return;
    } catch (err) {
      console.error(`Waiting for database to boot... (${retries} attempts left)`);
      retries -= 1;
      // Wait 2 seconds before trying again
      await new Promise(res => setTimeout(res, 2000));
    }
  }
  console.error("Could not connect to the database after multiple attempts.");
}

initDb();

module.exports = pool;
