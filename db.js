const mysql = require("mysql2/promise");

const dbConfig = {
  host: process.env.DB_HOST || "mysql",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "12345",
  database: process.env.DB_NAME || "mydb",
  waitForConnections: true,
  connectionLimit: 10,
};

const pool = mysql.createPool(dbConfig);

async function initDB() {
  let connected = false;
  let attempts = 0;

  while (!connected && attempts < 10) {
    try {
      const connection = await pool.getConnection();
      console.log("✅ Connected to MySQL. Ensuring table exists...");

      await connection.query(`
        CREATE TABLE IF NOT EXISTS customers (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      
      console.log("🚀 Table 'customers' is ready.");
      connection.release();
      connected = true;
    } catch (err) {
      attempts++;
      console.log(`⚠️ DB not ready yet (Attempt ${attempts}/10). Retrying in 3s...`);
      await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds
    }
  }
}

initDB();
module.exports = pool;
