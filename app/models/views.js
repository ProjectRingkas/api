module.exports = {
    getProduct: async function (connection, condition, value) {
        try {
            var [rowsProduct, ] = await connection.query(`SELECT * FROM view_detail_products WHERE ${condition} = ?`, [value]);
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
            var [rowsProduct, ] = await connection.query(`SELECT * FROM view_detail_products`);
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
    getAllProductsReport: async function (connection) {
        try {
            var [rowsProductOrders, ] = await connection.query(`SELECT * FROM view_products_order_report`);
            return {
                success: true,
                response: rowsProductOrders
            };
        } catch (ex) {
            return {
                success: false,
                response: ex
            }
        }
    },
    getOrderItems: async function (connection, condition, value) {
        try {
            var [rowsOrder, ] = await connection.query(`SELECT * FROM view_detail_order_items WHERE ${condition} = ?`, [value]);
            return {
                success: true,
                response: rowsOrder
            };
        } catch (ex) {
            return {
                success: false,
                response: ex
            }
        }
    },
    getBillItems: async function (connection, condition, value) {
        try {
            var [rowsBill, ] = await connection.query(`SELECT * FROM view_detail_bill_items WHERE ${condition} = ?`, [value]);
            return {
                success: true,
                response: rowsBill
            };
        } catch (ex) {
            return {
                success: false,
                response: ex
            }
        }
    },
    getAllPaymentsReport: async function (connection) {
        try {
            var [rowsPayment, ] = await connection.query(`SELECT * FROM view_payments_report`);
            return {
                success: true,
                response: rowsPayment
            };
        } catch (ex) {
            return {
                success: false,
                response: ex
            }
        }
    },
    getFilteredPaymentsReport: async function (connection, condition, value) {
        try {
            var [rowsPayment, ] = await connection.query(`SELECT * FROM view_payments_report ${condition}`, value);
            return {
                success: true,
                response: rowsPayment
            };
        } catch (ex) {
            return {
                success: false,
                response: ex
            }
        }
    },
};