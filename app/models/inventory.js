const DatabaseConnection = require('../config/connection');

module.exports = {
    getInventoryt: async function (condition, value) {
        var connection = await DatabaseConnection.get();
        try {
            var [rowsInventory, ] = await connection.execute(`SELECT * FROM inventory WHERE ${condition} = ?`, [value]);
            return {
                success: true,
                response: rowsInventory
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
    getAllInventories: async function () {
        var connection = await DatabaseConnection.get();
        try {
            var [rowsInventory, ] = await connection.execute(`SELECT * FROM inventory`);
            return {
                success: true,
                response: rowsInventory
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
    setInventory: async function (product_id, stock, limit_stock, type, description) {
        var connection = await DatabaseConnection.get();
        try {
            await connection.execute('INSERT INTO inventory (product_id, stock, limit_stock, type, description) VALUES (?, ?, ?, ?, ?)', [product_id, stock, limit_stock, type, description]);
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
    updateInventory: async function (product_id, stock) {
        var connection = await DatabaseConnection.get();
        try {
            await connection.execute('UPDATE inventory SET stock = ? WHERE product_id = ?', [stock, product_id]);
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