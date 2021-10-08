const DatabaseConnection = require('../config/connection');

module.exports = {
    getTransaction: async function (condition, value) {
        var connection = await DatabaseConnection.get();
        try {
            var [rowsTransc, ] = await connection.execute(`SELECT * FROM transaction WHERE ${condition} = ?`, [value]);
            return {
                success: true,
                response: rowsTransc
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
    getAllTransactions: async function () {
        var connection = await DatabaseConnection.get();
        try {
            var [rowsTransc, ] = await connection.execute('SELECT * FROM transaction');
            return {
                success: true,
                response: rowsTransc
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
    setTransaction: async function (date, total_payment, coa_credit_id, coa_debit_id, transaction_price_credit, transaction_price_debit, description) {
        var connection = await DatabaseConnection.get();
        try {
            await connection.execute('INSERT INTO transaction (date, total_payment, coa_credit_id, coa_debit_id, transaction_price_credit, transaction_price_debit, status, description) VALUES (?, ?, ?, ?, ?, ?, ?)', [date, total_payment, coa_credit_id, coa_debit_id, transaction_price_credit, transaction_price_debit, description]);
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