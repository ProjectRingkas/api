const DatabaseConnection = require('../config/connection');

module.exports = {
    getVendor: async function (condition, value) {
        var connection = await DatabaseConnection.get();
        try {
            var [rowsVendor, ] = await connection.execute(`SELECT * FROM vendor WHERE ${condition} = ?`, [value]);
            return {
                success: true,
                response: rowsVendor
            };
        } catch (ex) {
            connection.rollback();
            console.info('Rollback successful');
            return {
                success: false,
                response: ex
            }
        }
    },
    getAllVendors: async function () {
        var connection = await DatabaseConnection.get();
        try {
            var [rowsVendor, ] = await connection.execute(`SELECT * FROM vendors`);
            return {
                success: true,
                response: rowsVendor
            };
        } catch (ex) {
            connection.rollback();
            console.info('Rollback successful');
            return {
                success: false,
                response: ex
            }
        }
    },
    setVendor: async function (name, address, phone, description) {
        var connection = await DatabaseConnection.get();
        try {
            await connection.execute('INSERT INTO vendors (name, address, phone, description) VALUES (?, ?, ?, ?)', [name, address, phone, description]);
            return {
                success: true
            };
        } catch (ex) {
            connection.rollback();
            console.info('Rollback successful');
            return {
                success: false,
                response: ex
            };
        }
    },
};