module.exports = {
    getTransaction: async function (connection, condition, value) {
        try {
            var [rowsTransc, ] = await connection.query(`SELECT * FROM transaction WHERE ${condition} = ?`, [value]);
            return {
                success: true,
                response: rowsTransc
            };
        } catch (ex) {
            return {
                success: false,
                response: ex
            }
        }
    },
    getAllTransactions: async function (connection) {
        try {
            var [rowsTransc, ] = await connection.query('SELECT * FROM transaction');
            return {
                success: true,
                response: rowsTransc
            };
        } catch (ex) {
            return {
                success: false,
                response: ex
            }
        }
    },
    setTransaction: async function (connection, date, total_payment, coa_credit_id, coa_debit_id, transaction_price_credit, transaction_price_debit, description) {
        try {
            await connection.query('INSERT INTO transaction (date, total_payment, coa_credit_id, coa_debit_id, transaction_price_credit, transaction_price_debit, status, description) VALUES (?, ?, ?, ?, ?, ?, ?)', [date, total_payment, coa_credit_id, coa_debit_id, transaction_price_credit, transaction_price_debit, description]);
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