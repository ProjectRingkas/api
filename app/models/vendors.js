module.exports = {
    getVendor: async function (connection, condition, value) {
        try {
            var [rowsVendor, ] = await connection.query(`SELECT * FROM vendor WHERE ${condition} = ?`, [value]);
            return {
                success: true,
                response: rowsVendor
            };
        } catch (ex) {
            return {
                success: false,
                response: ex
            }
        }
    },
    getAllVendors: async function (connection) {
        try {
            var [rowsVendor, ] = await connection.query(`SELECT * FROM vendors`);
            return {
                success: true,
                response: rowsVendor
            };
        } catch (ex) {
            return {
                success: false,
                response: ex
            }
        }
    },
    setVendor: async function (connection, name, address, phone, description) {
        try {
            await connection.query('INSERT INTO vendors (name, address, phone, description) VALUES (?, ?, ?, ?)', [name, address, phone, description]);
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