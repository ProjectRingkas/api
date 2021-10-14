module.exports = {
    getCOA: async function (connection, condition, value) {
        try {
            var [rowsCOA, ] = await connection.query(`SELECT * FROM code_of_account WHERE ${condition} = ?`, [value]);
            return {
                success: true,
                response: rowsCOA
            };
        } catch (ex) {
            return {
                success: false,
                response: ex
            }
        }
    },
    getAllCOAs: async function (connection) {
        try {
            var [rowsCOA, ] = await connection.query(`SELECT * FROM code_of_account`);
            return {
                success: true,
                response: rowsCOA
            };
        } catch (ex) {
            return {
                success: false,
                response: ex
            }
        }
    },
    setCOA: async function (connection, number_id, name, group, transaction_category, saldo_category, report_category, description) {
        try {
            await connection.query('INSERT INTO code_of_account (number_id, name, group, transaction_category, saldo_category, report_category, description) VALUES (?, ?, ?, ?, ?, ?, ?)', [number_id, name, group, transaction_category, saldo_category, report_category, description]);
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