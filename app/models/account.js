const DatabaseConnection = require('../config/connection');

module.exports = {
    getAccountUser: async function (condition, value) {
        var connection = await DatabaseConnection.get();
        try {
            var [rowsAccount, ] = await connection.execute(`SELECT * FROM user WHERE ${condition} = ?`, [value]);
            return {
                success: true,
                response: rowsAccount
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
    setAccount: async function (username, password) {
        var connection = await DatabaseConnection.get();
        try {
            await connection.execute('INSERT INTO user (username, password) VALUES (?, ?)', [username, password]);
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