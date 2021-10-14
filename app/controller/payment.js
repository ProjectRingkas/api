const PoolConnection = require('../config/pool');
const Response = require('../middleware/res');
const OrdersModel = require('../models/orders')
const TransactionModel = require('../models/transaction');

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

module.exports = {
    getPayment: async function (request, response, next) {
        var {
            type,
            type_id
        } = request.query;
        if (!(type && type_id)) {
            var {
                type,
                type_id
            } = request.body;
        }

        if (type && type_id) {
            try {
                // Get pool connection
                var connection = await PoolConnection.get();
    
                switch (type) {
                    case "orders":
                        // get all payment from the invoice
                        var queryTransc = await TransactionModel.getTransaction(connection, 'orders', type_id);
                        if (!queryTransc.success) throw queryTransc.response;
                        if (queryTransc.response.length <= 0) throw new Error('PAY03');
                        var rowsTransc = queryTransc.response;

                        break;
                    case "bills":
                        // code
                        break;
                    default: throw new Error('PAY02');
                }
    
                Response.ok("get payment success", rowsTransc, response);
            } catch (ex) {
                //console.log(ex)
                next(ex);
            }
        } else {
            next(new Error('PAY03'));
        }
    },
    addPayment: async function (request, response, next) {
        const {
            date,
            type,
            type_id,
            coa_credit_id,
            coa_debit_id,
            amount,
            description,
        } = request.body;

        if (date && type && type_id && coa_credit_id && coa_debit_id && amount) {
            try {
                // Get pool connection
                var connection = await PoolConnection.getConnection();
                await connection.beginTransaction();

                // Create payment
                var queryPay = await TransactionModel.setTransaction(connection, date, type, type_id, coa_credit_id, coa_debit_id, amount, description);
                if (!queryPay.success) throw queryPay.response;

                // Check invoice type and update them
                switch (type) {
                    case "orders":
                        // Get total price of order
                        var queryOrder = await OrdersModel.getOrder(connection, 'id', type_id);
                        if (!queryOrder.success) throw queryOrder.response;
                        if (queryOrder.response.length < 1) throw Response.no("invoice not found", { 'invoice_type': type, 'invoice_id': type_id  }, response);
                        var rowsOrder = queryOrder.response;

                        // get all payment from the invoice
                        var queryTransc = await TransactionModel.getTransaction(connection, 'orders', type_id);
                        if (!queryTransc.success) throw queryTransc.response;
                        var rowsTransc = queryTransc.response;

                        // calculate remaining debt
                        var debt = Number(rowsOrder[0].total_price);
                        await asyncForEach(rowsTransc, async function (transc) {
                            debt -= Number(transc.amount);
                        });

                        // round debt to 2 decimal
                        debt = (Math.round(debt * 100) / 100).toFixed(2);

                        // Check if payment complete
                        var status = "Partially Paid";
                        if (debt <= 0)
                        {
                            debt = '-';
                            status = "Fully Paid";
                        }

                        // Update the order status
                        var queryOrder = await OrdersModel.updateOrder(connection, 'status', status, type_id);
                        if (!queryOrder.success) throw queryOrder.response;

                        break;
                    case "bills":
                        // code
                        break;
                    default: throw new Error('PAY02');
                }

                await connection.commit();
                await connection.release();

                data = { 
                    'invoice_type': type,
                    'invoice_id': type_id,
                    'invoice_price': rowsOrder[0].total_price,
                    'payment_amount': amount,
                    'debt_remaining': debt,
                    'status': status
                }
                Response.ok("create payment success", data, response);
            } catch (ex) {
                //console.log(ex)
                await connection.rollback();
                await connection.release();
                console.log("rollback success")
                next(ex);
            }
        } else {
            next(new Error('PAY01'));
        }
    },
};