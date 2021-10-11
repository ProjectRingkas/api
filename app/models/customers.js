module.exports = {
    getCustomer: async function (connection, condition, value) {
        try {
            var [rowsCustomer, ] = await connection.query(`SELECT * FROM customers WHERE ${condition} = ?`, [value]);
            return {
                success: true,
                response: rowsCustomer
            };
        } catch (ex) {
            return {
                success: false,
                response: ex
            }
        }
    },
    getAllCustomers: async function (connection) {
        try {
            var [rowsCustomer, ] = await connection.query(`SELECT * FROM customers`);
            return {
                success: true,
                response: rowsCustomer
            };
        } catch (ex) {
            return {
                success: false,
                response: ex
            }
        }
    },
    setCustomer: async function (connection, name, address, phone, description) {
        try {
            await connection.query('INSERT INTO customers (name, address, phone, description) VALUES (?, ?, ?, ?)', [name, address, phone, description]);
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