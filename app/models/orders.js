const DatabaseConnection = require('../config/connection');

module.exports = {
    getOrder: async function (condition, value) {
        var connection = await DatabaseConnection.get();
        try {
            var [rowsOrder, ] = await connection.execute(`SELECT * FROM orders WHERE ${condition} = ?`, [value]);
            return {
                success: true,
                response: rowsOrder
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
    getAllOrders: async function () {
        var connection = await DatabaseConnection.get();
        try {
            var [rowsOrder, ] = await connection.execute(`SELECT * FROM orders`);
            return {
                success: true,
                response: rowsOrder
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
    setOrder: async function (customer_id, product_id, transaction_price, amount, discount, description, status, date, transaction_id) {
        var connection = await DatabaseConnection.get();
        try {
            await connection.execute('INSERT INTO orders (customer_id, product_id, transaction_price, amount, discount, description, status, date, transaction_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [customer_id, product_id, transaction_price, amount, discount, description, status, date, transaction_id]);
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