const mysql = require('mysql2');

//konfiurasi koneksi database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // sesuaikan password MySQL kamu
  database: 'dbpraktikum8'
});

//coba koneksi
db.connect(err => {
  if (err) {
    console.error('Koneksi database gagal:', err);
  } else {
  console.log('Terhubung ke database MySQL');
  }
});

module.exports = db;
