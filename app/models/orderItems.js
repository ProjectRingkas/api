module.exports = {
    getOrderItems: async function (connection, condition, value) {
        try {
            var [rowsOrderItems, ] = await connection.query(`SELECT * FROM order_items WHERE ${condition} = ?`, [value]);
            return {
                success: true,
                response: rowsOrderItems
            };
        } catch (ex) {
            return {
                success: false,
                response: ex
            }
        }
    },
    setOrderItem: async function (connection, order_id, product_id, transaction_price, quantity, discount) {
        try {
            await connection.query('INSERT INTO order_items (order_id, product_id, transaction_price, quantity, discount) VALUES (?, ?, ?, ?, ?)', [order_id, product_id, transaction_price, quantity, discount]);
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