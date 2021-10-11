module.exports = {
    getCode: async function (connection, condition, value) {
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
    setCode: async function (connection, number_id, name, description, transaction_category, saldo_category, report_category) {
        try {
            await connection.query('INSERT INTO code_of_account (number_id, name, description, transaction_category, saldo_category, report_category) VALUES (?, ?, ?, ?, ?, ?)', [number_id, name, description, transaction_category, saldo_category, report_category]);
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