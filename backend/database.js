const mysql = require("mysql2");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true, // Menunggu koneksi tersedia jika semua koneksi digunakan
  connectionLimit: 10, // Maksimal 10 koneksi dalam pool
  queueLimit: 0, // Tidak ada batasan antrian untuk koneksi
});

// Menangani error pada pool
pool.on("error", (err) => {
  console.error("Database error: ", err);
});

module.exports = pool.promise(); // Ekspor pool dengan promise
    