module.exports = {
    getCategory: async function (connection, condition, value) {
        try {
            var [rowsCategory, ] = await connection.query(`SELECT * FROM category WHERE ${condition} = ?`, [value]);
            return {
                success: true,
                response: rowsCategory
            };
        } catch (ex) {
            return {
                success: false,
                response: ex
            }
        }
    },
    getAllCategories: async function (connection) {
        try {
            var [rowsCategory, ] = await connection.query(`SELECT * FROM category`);
            return {
                success: true,
                response: rowsCategory
            };
        } catch (ex) {
            return {
                success: false,
                response: ex
            }
        }
    },
    setCategory: async function (connection, name, description) {
        try {
            await connection.query('INSERT INTO category (name, description) VALUES (?, ?)', [name, description]);
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