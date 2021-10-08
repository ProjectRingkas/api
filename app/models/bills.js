const DatabaseConnection = require('../config/connection');

module.exports = {
    getBill: async function (condition, value) {
        var connection = await DatabaseConnection.get();
        try {
            var [rowsBill, ] = await connection.execute(`SELECT * FROM bills WHERE ${condition} = ?`, [value]);
            return {
                success: true,
                response: rowsBill
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
    getAllBills: async function () {
        var connection = await DatabaseConnection.get();
        try {
            var [rowsBill, ] = await connection.execute('SELECT * FROM bills');
            return {
                success: true,
                response: rowsBill
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
    setBill: async function (vendor_id, product_id, transaction_price, periodic, amount, discount, description, status, date, transaction_id) {
        var connection = await DatabaseConnection.get();
        try {
            await connection.execute('INSERT INTO bills (vendor_id, product_id, transaction_price, periodic, amount, discount, description, status, date, transaction_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [vendor_id, product_id, transaction_price, periodic, amount, discount, description, status, date, transaction_id]);
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