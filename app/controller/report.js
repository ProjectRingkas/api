const PoolConnection = require('../config/pool');
const Response = require('../middleware/res');
const ViewsModel = require('../models/views')

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

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

            // Filter result
            await asyncForEach(rowsProductsReport, async function (row) {
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
    getAllPaymentsReport: async function (request, response, next) {
        try {
            // Get pool connection
            var connection = await PoolConnection.get();

            // get all payment report
            var queryPaymentReport = await ViewsModel.getAllPaymentsReport(connection);
            if (!queryPaymentReport.success) throw queryPaymentReport.response;
            if (queryPaymentReport.response.length <= 0) throw new Error('PAY03');
            var rowsPaymentReport = queryPaymentReport.response;


            Response.ok("get payments report success", rowsPaymentReport, response);
        } catch (ex) {
            //console.log(ex)
            next(ex);
        }
    },
    getFilteredPaymentsReport: async function (request, response, next) {
        var {
            saldo_category,
            transaction_category,
            report_category
        } = request.query;

        if (!saldo_category) {
            var {
                saldo_category
            } = request.body;
        }
        if (!transaction_category) {
            var {
                transaction_category
            } = request.body;
        }
        if (!report_category) {
            var {
                report_category
            } = request.body;
        }

        if (saldo_category) {
            try {
                // Check saldo_category value to decide category column
                var saldoColumn = '';
                var transcColumn = '';
                var reportColumn = '';

                if (saldo_category == 'kredit') {
                    saldoColumn = "credit_category = ?"
                    transcColumn = "credit_transc_category = ?";
                    reportColumn = "credit_report_category = ?";

                } else if (saldo_category == 'debit') {
                    saldoColumn = "debit_category = ?"
                    transcColumn = "debit_transc_category = ?";
                    reportColumn = "debit_report_category = ?";

                } else {
                    throw new Error('PAY04');
                }

                // Create condition clause based on paramter
                var condition = 'WHERE ' + saldoColumn;
                var arrayValues = [saldo_category.toUpperCase()];

                // If there is transaction_category param
                if (transaction_category) {
                    condition = condition + ' AND ' + transcColumn;
                    arrayValues.push(transaction_category);
                }
                // If there is report_category param
                if (report_category) {
                    condition = condition + ' AND ' + reportColumn;
                    arrayValues.push(report_category);
                } 

                // Get pool connection
                var connection = await PoolConnection.get();
    
                console.log(condition);
                console.log(arrayValues);

                // get all payment report
                var queryPaymentReport = await ViewsModel.getFilteredPaymentsReport(connection, condition, arrayValues);
                if (!queryPaymentReport.success) throw queryPaymentReport.response;
                if (queryPaymentReport.response.length <= 0) throw new Error('PAY03');
                var rowsPaymentReport = queryPaymentReport.response;

                // Filter result column
                await asyncForEach(rowsPaymentReport, async function (row) {
                    if (saldo_category == 'kredit') {
                        delete row.coa_debit_id;
                        delete row.debit_category;
                        delete row.debit_name;
                        delete row.debit_group;
                        delete row.debit_transc_category;
                        delete row.debit_report_category;
                    } else if (saldo_category == 'debit') {
                        delete row.coa_credit_id;
                        delete row.credit_category;
                        delete row.credit_name;
                        delete row.credit_group;
                        delete row.credit_transc_category;
                        delete row.credit_report_category;
                    }
                });
                
                Response.ok("get filtered payments report success", rowsPaymentReport, response);
            } catch (ex) {
                //console.log(ex)
                next(ex);
            }
        } else {
            next(new Error('PAY04'));
        }
    },
};