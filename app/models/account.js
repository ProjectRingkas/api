module.exports = {
    getAccount: async function (connection, condition, value) {
        try {
            var [rowsAccount, ] = await connection.query(`SELECT * FROM user WHERE ${condition} = ?`, [value]);
            return {
                success: true,
                response: rowsAccount
            };
        } catch (ex) {
            return {
                success: false,
                response: ex
            }
        }
    },
    getAccountUseConnection: async function (connection, condition, value) {
        try {
            var [rowsAccount, ] = await connection.query(`SELECT * FROM user WHERE ${condition} = ?`, [value]);
            return {
                success: true,
                response: rowsAccount
            };
        } catch (ex) {
            return {
                success: false,
                response: ex
            }
        }
    },
    setAccount: async function (connection, username, password) {
        try {
            await connection.query('INSERT INTO user (username, password) VALUES (?, ?)', [username, password]);
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