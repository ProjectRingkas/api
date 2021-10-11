module.exports = {
    getProduct: async function (connection, condition, value) {
        try {
            var [rowsProduct, ] = await connection.query(`SELECT * FROM products WHERE ${condition} = ?`, [value]);
            return {
                success: true,
                response: rowsProduct
            };
        } catch (ex) {
            return {
                success: false,
                response: ex
            }
        }
    },
    getAllProducts: async function (connection) {
        try {
            var [rowsProduct, ] = await connection.query(`SELECT * FROM products`);
            return {
                success: true,
                response: rowsProduct
            };
        } catch (ex) {
            return {
                success: false,
                response: ex
            }
        }
    },
    setProduct: async function (connection, category_id, name, type, description, supplier, price) {
        try {
            await connection.query('INSERT INTO products (category_id, name, type, description, supplier, price) VALUES (?, ?, ?, ?, ?, ?)', [category_id, name, type, description, supplier, price]);
            var [rowsProduct] = await connection.execute('SELECT LAST_INSERT_ID() as product_id');
            return {
                success: true,
                response: rowsProduct
            };
        } catch (ex) {
            return {
                success: false,
                response: ex
            };
        }
    },
};