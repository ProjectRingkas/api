const DatabaseConnection = require('../config/connection');

module.exports = {
    getUserDetail: async function (condition, value) {
        var connection = await DatabaseConnection.get();
        try {
            var [rowsUser, ] = await connection.execute(`SELECT * FROM detail_user WHERE ${condition} = ?`, [value]);
            return {
                success: true,
                response: rowsUser
            };
        } catch (ex) {
            connection.rollback();
            console.info('Rollback successful');
            return {
                success: false,
                response: ex
            }
        }
    },
    setUserDetail: async function (user_id, name, address) {
        var connection = await DatabaseConnection.get();
        try {
            await connection.execute('INSERT INTO detail_user (user_id, name, address) VALUES (?, ?)', [user_id, name, address]);
            return {
                success: true
            };
        } catch (ex) {
            connection.rollback();
            console.info('Rollback successful');
            return {
                success: false,
                response: ex
            };
        }
    },
    updateUserDetail: async function (user_id, name, address) {
        var connection = await DatabaseConnection.get();
        try {
            await connection.execute('UPDATE detail_user SET name = ?, address = ? WHERE user_id = ?', [name, address, user_id]);
            return {
                success: true
            };
        } catch (ex) {
            connection.rollback();
            console.info('Rollback successful');
            return {
                success: false,
                response: ex
            };
        }
    },
};