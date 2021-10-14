module.exports = {
    getTransaction: async function (connection, type, type_id) {
        try {
            var [rowsTransc, ] = await connection.query(`SELECT * FROM transaction WHERE type = ? and type_id = ?`, [type, type_id]);
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
    setTransaction: async function (connection, date, type, type_id, coa_credit_id, coa_debit_id, amount, description) {
        try {
            await connection.query('INSERT INTO transaction (date, type, type_id, coa_credit_id, coa_debit_id, amount, description) VALUES (?, ?, ?, ?, ?, ?, ?)', [date, type, type_id, coa_credit_id, coa_debit_id, amount, description]);
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