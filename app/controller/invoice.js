const PoolConnection = require('../config/pool');
const Response = require('../middleware/res');
const OrdersModel = require('../models/orders')
const ViewsModel = require('../models/views')
const TransactionModel = require('../models/transaction')

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}


module.exports = {
    getOrder: async function (request, response, next) {
        var {
            order_id
        } = request.query;
        if (!order_id) {
            var {
                order_id
            } = request.body;
        }

        if (order_id) {
            try {
                // Get pool connection
                var connection = await PoolConnection.get();
    
                // Get Order
                var queryOrder = await OrdersModel.getOrder(connection, 'id', order_id);
                if (!queryOrder.success) throw queryOrder.response;
                var rowsOrder = queryOrder.response;

                // Get Order Item
                var queryOrderItems = await ViewsModel.getOrderItems(connection, 'order_id', order_id);
                if (!queryOrderItems.success) throw queryOrderItems.response;
                var rowsOrderItems = queryOrderItems.response;

                // Merge items to order
                rowsOrder[0].order_items = rowsOrderItems;

                // If payment complete
                if (rowsOrder[0].transaction_id)
                {
                    var queryTransc = await TransactionModel.getTransaction(connection, 'id', rowsOrder[0].transaction_id);
                    if (!queryTransc.success) throw queryTransc.response;
                    var rowsTransc = queryTransc.response;

                    // Merge payment to order
                    rowsOrder[0].transaction_detail = rowsTransc;
                }
    
                Response.ok("get invoice success", rowsOrder, response);
            } catch (ex) {
                //console.log(ex)
                next(ex);
            }
        } else {
            next(new Error('INVC01'));
        }
    },
    getAllOrders: async function (request, response, next) {
        try {
            // Get pool connection
            var connection = await PoolConnection.get();

            // Get Order
            var queryOrder = await OrdersModel.getAllOrders(connection);
            if (!queryOrder.success) throw queryOrder.response;
            var rowsOrder = queryOrder.response;

            var arrayOrders = [];

            await asyncForEach(rowsOrder, async function (order) {
                // Get Order Item
                var queryOrderItems = await ViewsModel.getOrderItems(connection, 'order_id', order.id);
                if (!queryOrderItems.success) throw queryOrderItems.response;
                var rowsOrderItems = queryOrderItems.response;

                // Merge items to order
                order.order_items = rowsOrderItems;

                // If payment complete
                if (order.transaction_id)
                {
                    var queryTransc = await TransactionModel.getTransaction(connection, 'id', order.transaction_id);
                    if (!queryTransc.success) throw queryTransc.response;
                    var rowsTransc = queryTransc.response;

                    // Merge payment to order
                    order.transaction_detail = rowsTransc;
                }

                arrayOrders.push({
                    order
                });
            });
            
            Response.ok("get all invoice success", arrayOrders, response);
        } catch (ex) {
            //console.log(ex)
            next(ex);
        }
    },
};