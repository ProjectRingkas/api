const mysql = require('mysql2/promise');
const DB = require('../config/db');

module.exports = {
    init: async () => {
        this.pool = await mysql.createPool(DB);
        console.log('Pool Connected');
    },
    get: async () => {
        return this.pool;
    },
    getConnection: async () => {
        return this.pool.getConnection();
    }
};