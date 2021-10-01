const mysql = require('mysql2/promise');
const DB = require('../config/db');

module.exports = {
    init: async function () {
        this.connection = await mysql.createConnection(DB);
        console.log('connected');
    },
    start: async function () {
        try {
            await this.connection.beginTransaction();
            console.log('mysql create transaction');
            return true
        } catch (ex) {
            return false
        }
        
    },
    commit: async function () {
        try {
            await this.connection.commit();
            console.log('mysql commit transaction');
            return true;
        } catch (ex) {
            this.connection.rollback();
            console.info('Rollback successful');
            return false;
        }
    },
    get: async function () {
        return this.connection;
    }
};