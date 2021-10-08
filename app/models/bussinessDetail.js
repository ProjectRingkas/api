const DatabaseConnection = require('../config/connection');

module.exports = {
    getBussinessDetail: async function (condition, value) {
        var connection = await DatabaseConnection.get();
        try {
            var [rowsUser, ] = await connection.execute(`SELECT * FROM bussiness_detail WHERE ${condition} = ?`, [value]);
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
    setBussinessDetail: async function (user_id, name, address, description) {
        var connection = await DatabaseConnection.get();
        try {
            await connection.execute('INSERT INTO bussiness_detail (user_id, name, address, description) VALUES (?, ?, ?, ?)', [user_id, name, address, description]);
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
    updateBussinessDetail: async function (user_id, name, address, description) {
        var connection = await DatabaseConnection.get();
        try {
            await connection.execute('UPDATE bussiness_detail SET name = ?, address = ?, description = ? WHERE user_id = ?', [name, address, description, user_id]);
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