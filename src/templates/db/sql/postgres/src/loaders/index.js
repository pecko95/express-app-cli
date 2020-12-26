const expressApp = require("express");
const { pool } = require("../db/index");

async function loader(app) {
    // Establish connection to the express server
    await expressApp(app);
    console.log("Express server started.");

    // Establish connection to database
    await pool;
    console.log("Connected to database...");
    
    // More loaders can be added here...
};

module.exports = loader;

