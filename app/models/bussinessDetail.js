module.exports = {
    getBussinessDetail: async function (connection, condition, value) {
        try {
            var [rowsUser, ] = await connection.query(`SELECT * FROM bussiness_detail WHERE ${condition} = ?`, [value]);
            return {
                success: true,
                response: rowsUser
            };
        } catch (ex) {
            return {
                success: false,
                response: ex
            }
        }
    },
    setBussinessDetail: async function (connection, user_id, name, address, description) {
        try {
            await connection.query('INSERT INTO bussiness_detail (user_id, name, address, description) VALUES (?, ?, ?, ?)', [user_id, name, address, description]);
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
    updateBussinessDetail: async function (connection, user_id, name, address, description) {
        try {
            await connection.query('UPDATE bussiness_detail SET name = ?, address = ?, description = ? WHERE user_id = ?', [name, address, description, user_id]);
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