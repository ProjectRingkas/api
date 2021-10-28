module.exports = {
    getOrder: async function (connection, condition, value) {
        try {
            var [rowsOrder, ] = await connection.query(`SELECT * FROM orders WHERE ${condition} = ?`, [value]);
            return {
                success: true,
                response: rowsOrder
            };
        } catch (ex) {
            return {
                success: false,
                response: ex
            }
        }
    },
    getAllOrders: async function (connection) {
        try {
            var [rowsOrder, ] = await connection.query(`SELECT * FROM orders`);
            return {
                success: true,
                response: rowsOrder
            };
        } catch (ex) {
            return {
                success: false,
                response: ex
            }
        }
    },
    setOrder: async function (connection, invoice_number, order_number, customer_id, description, date, due, status) {
        try {
            await connection.query('INSERT INTO orders (invoice_number, order_number, customer_id, description, date, due, status) VALUES (?, ?, ?, ?, ?, ?, ?)', [invoice_number, order_number, customer_id, description, date, due, status]);
            var [rowsOrder] = await connection.execute('SELECT LAST_INSERT_ID() as order_id');
            return {
                success: true,
                response: rowsOrder
            };
        } catch (ex) {
            return {
                success: false,
                response: ex
            };
        }
    },
    updateOrder: async function (connection, condition, value, order_id) {
        try {
            await connection.query(`UPDATE orders SET ${condition} = ? WHERE id = ?`, [value, order_id]);
            return {
                success: true
            };
        } catch (ex) {
            return {
                success: false,
                response: ex
            }
        }
    },
};