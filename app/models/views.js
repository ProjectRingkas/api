const DatabaseConnection = require('../config/connection');

module.exports = {
    getProduct: async function (condition, value) {
        var connection = await DatabaseConnection.get();
        try {
            var [rowsProduct, ] = await connection.execute(`SELECT * FROM view_detail_products WHERE ${condition} = ?`, [value]);
            return {
                success: true,
                response: rowsProduct
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
    getAllProducts: async function () {
        var connection = await DatabaseConnection.get();
        try {
            var [rowsProduct, ] = await connection.execute(`SELECT * FROM view_detail_products`);
            return {
                success: true,
                response: rowsProduct
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
    getOrder: async function (condition, value) {
        var connection = await DatabaseConnection.get();
        try {
            var [rowsOrder, ] = await connection.execute(`SELECT * FROM view_detail_orders WHERE ${condition} = ?`, [value]);
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
    getAllOrders: async function (condition, value) {
        var connection = await DatabaseConnection.get();
        try {
            var [rowsProduct, ] = await connection.execute(`SELECT * FROM view_detail_orders`);
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
};