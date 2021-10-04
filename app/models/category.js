const DatabaseConnection = require('../config/connection');

module.exports = {
    getCategory: async function (condition, value) {
        var connection = await DatabaseConnection.get();
        try {
            var [rowsCategory, ] = await connection.execute(`SELECT * FROM category WHERE ${condition} = ?`, [value]);
            return {
                success: true,
                response: rowsCategory
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
    getAllCategories: async function () {
        var connection = await DatabaseConnection.get();
        try {
            var [rowsCategory, ] = await connection.execute(`SELECT * FROM category`);
            return {
                success: true,
                response: rowsCategory
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
    setCategory: async function (name, description) {
        var connection = await DatabaseConnection.get();
        try {
            await connection.execute('INSERT INTO category (name, description) VALUES (?, ?)', [name, description]);
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