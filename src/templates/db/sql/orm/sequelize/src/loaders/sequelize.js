const { Sequelize } = require("sequelize");
const config = require("../config/index");

// Create an instance of Sequelize
const db = new Sequelize(config.DB, config.DB_USER, config.DB_PASSWORD, {
    host: config.DB_HOST,
    dialect: config.DB_DIALECT,

    // If using SQLite only - if not, remove
    // storage: 'path/to/database.sqlite'
});

module.exports = db;