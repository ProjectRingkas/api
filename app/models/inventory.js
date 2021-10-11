module.exports = {
    getInventoryt: async function (connection, condition, value) {
        try {
            var [rowsInventory, ] = await connection.query(`SELECT * FROM inventory WHERE ${condition} = ?`, [value]);
            return {
                success: true,
                response: rowsInventory
            };
        } catch (ex) {
            return {
                success: false,
                response: ex
            }
        }
    },
    getAllInventories: async function (connection) {
        try {
            var [rowsInventory, ] = await connection.query(`SELECT * FROM inventory`);
            return {
                success: true,
                response: rowsInventory
            };
        } catch (ex) {
            return {
                success: false,
                response: ex
            }
        }
    },
    setInventory: async function (connection, product_id, stock, limit_stock, type, description) {
        try {
            await connection.query('INSERT INTO inventory (product_id, stock, limit_stock, type, description) VALUES (?, ?, ?, ?, ?)', [product_id, stock, limit_stock, type, description]);
            return {
                success: true
            };
        } catch (ex) {
            return {
                success: false,
                response: ex
            };
        }
    },
    updateInventory: async function (connection, product_id, stock) {
        try {
            await connection.query('UPDATE inventory SET stock = ? WHERE product_id = ?', [stock, product_id]);
            return {
                success: true
            };
        } catch (ex) {
            return {
                success: false,
                response: ex
            };
        }
    },
};