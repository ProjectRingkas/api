module.exports = {
    getUserDetail: async function (connection, condition, value) {
        try {
            var [rowsUser, ] = await connection.query(`SELECT * FROM detail_user WHERE ${condition} = ?`, [value]);
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
    setUserDetail: async function (connection, user_id, name, address) {
        try {
            await connection.query('INSERT INTO detail_user (user_id, name, address) VALUES (?, ?)', [user_id, name, address]);
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
    updateUserDetail: async function (connection, user_id, name, address) {
        try {
            await connection.query('UPDATE detail_user SET name = ?, address = ? WHERE user_id = ?', [name, address, user_id]);
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