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
    setOrder: async function (connection, customer_id, description, date, status) {
        try {
            await connection.query('INSERT INTO orders (customer_id, description, date, status) VALUES (?, ?, ?, ?)', [customer_id, description, date, status]);
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
};