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
    setProduct: async function (category_id, name, type, description, supplier, price) {
        var connection = await DatabaseConnection.get();
        try {
            await connection.execute('INSERT INTO products (category_id, name, type, description, supplier, price) VALUES (?, ?, ?, ?, ?, ?)', [category_id, name, type, description, supplier, price]);
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