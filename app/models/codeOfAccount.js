const DatabaseConnection = require('../config/connection');

module.exports = {
    getCode: async function (condition, value) {
        var connection = await DatabaseConnection.get();
        try {
            var [rowsCOA, ] = await connection.execute(`SELECT * FROM code_of_account WHERE ${condition} = ?`, [value]);
            return {
                success: true,
                response: rowsCOA
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
    setCode: async function (number_id, name, description, transaction_category, saldo_category, report_category) {
        var connection = await DatabaseConnection.get();
        try {
            await connection.execute('INSERT INTO code_of_account (number_id, name, description, transaction_category, saldo_category, report_category) VALUES (?, ?, ?, ?, ?, ?)', [number_id, name, description, transaction_category, saldo_category, report_category]);
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