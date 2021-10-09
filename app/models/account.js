const DatabaseConnection = require('../config/connection');
const PoolConnection = require('../config/pool');

module.exports = {
    getAccount: async function (condition, value) {
        //var connection = await DatabaseConnection.get();
        var pool = await PoolConnection.get();
        try {
            //var [rowsAccount, ] = await connection.execute(`SELECT * FROM user WHERE ${condition} = ?`, [value]);
            var [rowsAccount, ] = await pool.query(`SELECT * FROM user WHERE ${condition} = ?`, [value]);
            return {
                success: true,
                response: rowsAccount
            };
        } catch (ex) {
            //connection.rollback();
            //console.info('Rollback successful');
            return {
                success: false,
                response: ex
            }
        }
    },
    getAccountUseConnection: async function (condition, value) {
        var connection = await PoolConnection.getConnection();
        try {
            await connection.query('START TRANSACTION');
            var [rowsAccount, ] = await connection.query(`SELECT * FROM user WHERE ${condition} = ?`, [value]);
            await connection.query("COMMIT");
            return {
                success: true,
                response: rowsAccount
            };
        } catch (ex) {
            await connection.query("ROLLBACK");
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