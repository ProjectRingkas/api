module.exports = {
    getBill: async function (connection, condition, value) {
        try {
            var [rowsBill, ] = await connection.query(`SELECT * FROM bills WHERE ${condition} = ?`, [value]);
            return {
                success: true,
                response: rowsBill
            };
        } catch (ex) {
            return {
                success: false,
                response: ex
            }
        }
    },
    getAllBills: async function (connection) {
        try {
            var [rowsBill, ] = await connection.query('SELECT * FROM bills');
            return {
                success: true,
                response: rowsBill
            };
        } catch (ex) {
            return {
                success: false,
                response: ex
            }
        }
    },
    setBill: async function (connection, vendor_id, periodic, type, description, date, status) {
        try {
            await connection.query('INSERT INTO bills (vendor_id, periodic, type, description, date, status) VALUES (?, ?, ?, ?, ?, ?)', [vendor_id, periodic, type, description, date, status]);
            var [rowsBill] = await connection.execute('SELECT LAST_INSERT_ID() as bill_id');
            return {
                success: true,
                response: rowsBill
            };
        } catch (ex) {
            return {
                success: false,
                response: ex
            };
        }
    },
    updateBill: async function (connection, condition, value, order_id) {
        try {
            await connection.query(`UPDATE bills SET ${condition} = ? WHERE id = ?`, [value, order_id]);
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