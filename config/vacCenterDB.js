const mysql = require("mysql");

var connection = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "chatreeK2025.macos",
    database: "vacCenter"
});

module.exports = connection;