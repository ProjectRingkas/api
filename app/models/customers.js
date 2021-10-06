const DatabaseConnection = require('../config/connection');

module.exports = {
    getCustomer: async function (condition, value) {
        var connection = await DatabaseConnection.get();
        try {
            var [rowsCustomer, ] = await connection.execute(`SELECT * FROM customers WHERE ${condition} = ?`, [value]);
            return {
                success: true,
                response: rowsCustomer
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
    getAllCustomers: async function () {
        var connection = await DatabaseConnection.get();
        try {
            var [rowsCustomer, ] = await connection.execute(`SELECT * FROM customers`);
            return {
                success: true,
                response: rowsCustomer
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
    setCustomer: async function (name, address, phone, description) {
        var connection = await DatabaseConnection.get();
        try {
            await connection.execute('INSERT INTO customers (name, address, phone, description) VALUES (?, ?, ?, ?)', [name, address, phone, description]);
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