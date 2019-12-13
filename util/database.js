const mysql = require('mysql2');

const pool = mysql.createPool({
    host: '207.62.170.219',//'localhost',
    user: 'root',
    database: 'Fish',
    password: 'chaemin3211'
});

module.exports = pool.promise();