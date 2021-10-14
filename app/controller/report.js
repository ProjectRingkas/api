const PoolConnection = require('../config/pool');
const Response = require('../middleware/res');
const ViewsModel = require('../models/views')

module.exports = {
    getAllProductsReport: async function (request, response, next) {
        try {
            // Get pool connection
            var connection = await PoolConnection.get();

            // Get all products report
            var queryProductsReport = await ViewsModel.getAllProductsReport(connection);
            if (!queryProductsReport.success) throw queryProductsReport.response;
            var rowsProductsReport = queryProductsReport.response;

            var data = {
                'total_products_sold' : 0,
                'total_products_orders' : 0,
                'total_unit_products_sold' : 0,
                'total_all_products_income' : 0,
            };

            var arrayProducts = [];

            rowsProductsReport.forEach(function(row) {
                if (row.product_id == "Total") {
                    data.total_products_sold = row.name;
                    data.total_products_orders = row.orders;
                    data.total_unit_products_sold = row.total_sold;
                    data.total_all_products_income = (Math.round(row.total_income * 100) / 100).toFixed(2);
                } else {
                    arrayProducts.push(row);
                }
            });

            // Merge array to data
            data.products_data = arrayProducts;

            Response.ok("get all products report success", data, response);
        } catch (ex) {
            //console.log(ex)
            next(ex);
        }
    },
};