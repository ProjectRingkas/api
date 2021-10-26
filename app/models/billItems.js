module.exports = {
    getBillItem: async function (connection, condition, value) {
        try {
            var [rowsBillItem, ] = await connection.query(`SELECT * FROM bill_items WHERE ${condition} = ?`, [value]);
            return {
                success: true,
                response: rowsBillItem
            };
        } catch (ex) {
            return {
                success: false,
                response: ex
            }
        }
    },
    setBillItem: async function (connection, bill_id, product_id, transaction_price, quantity, discount) {
        try {
            await connection.query('INSERT INTO bill_items (bill_id, product_id, transaction_price, quantity, discount) VALUES (?, ?, ?, ?, ?)', [bill_id, product_id, transaction_price, quantity, discount]);
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