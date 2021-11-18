const PoolConnection = require('../config/pool');
const Response = require('../middleware/res');
const CustomersModel = require('../models/customers')
const OrdersModel = require('../models/orders')
const OrderItemsModel = require('../models/orderItems')
const InventoryModel = require('../models/inventory')
const ViewsModel = require('../models/views')
const TransactionModel = require('../models/transaction');

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
                if (queryOrder.response.length <= 0) throw new Error('INVC01');
                var rowsOrder = queryOrder.response;

                // Get Customer
                var queryCustomer = await CustomersModel.getCustomer(connection, 'id', rowsOrder[0].customer_id);
                if (!queryCustomer.success) throw queryCustomer.response;
                var rowCustomer = queryCustomer.response;

                // Merge customer to order
                rowsOrder[0].customer = rowCustomer;

                // Get Order Item
                var queryOrderItems = await ViewsModel.getOrderItems(connection, 'order_id', order_id);
                if (!queryOrderItems.success) throw queryOrderItems.response;
                var rowsOrderItems = queryOrderItems.response;

                // Merge items to order
                rowsOrder[0].order_items = rowsOrderItems;

                // If there is payment for the order
                var queryTransc = await TransactionModel.getTransaction(connection, 'orders', order_id);
                if (!queryTransc.success) throw queryTransc.response;
                var rowsTransc = queryTransc.response;
                if (rowsTransc.length > 1) {
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
                // Get Customer
                var queryCustomer = await CustomersModel.getCustomer(connection, 'id', order.customer_id);
                if (!queryCustomer.success) throw queryCustomer.response;
                var rowCustomer = queryCustomer.response;

                // Merge customer to order
                order.customer = rowCustomer;

                // Get Order Item
                var queryOrderItems = await ViewsModel.getOrderItems(connection, 'order_id', order.id);
                if (!queryOrderItems.success) throw queryOrderItems.response;
                var rowsOrderItems = queryOrderItems.response;

                // Merge items to order
                order.order_items = rowsOrderItems;

                // If there is payment for the order
                var queryTransc = await TransactionModel.getTransaction(connection, 'orders', order.id);
                if (!queryTransc.success) throw queryTransc.response;
                var rowsTransc = queryTransc.response;
                if (rowsTransc.length > 1) {
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
    addOrder: async function (request, response, next) {
        const {
            customer_id,
            invoice_number,
            order_number,
            date,
            due,
            items,
            description
        } = request.body;

        if (invoice_number && order_number && customer_id && date && due && items) {
            try {
                // Get pool connection
                var connection = await PoolConnection.getConnection();
                await connection.beginTransaction();

                // Add Order
                var status = "Pending"
                var queryOrder = await OrdersModel.setOrder(connection, invoice_number, order_number, customer_id, description, date, due, status);
                if (!queryOrder.success) throw queryOrder.response;
                var rowsOrder = queryOrder.response;

                // Parse items json
                var arrayItems = JSON.parse(items);

                // Set Order Items
                var total_order_price = 0;
                var unkownError = true;
                await asyncForEach(arrayItems, async function (item) {
                    // Check Item stock
                    var queryInven = await InventoryModel.getInventory(connection, 'product_id', item.product_id);
                    if (!queryInven.success) throw queryInven.response;
                    var rowsInven = queryInven.response;
                    if (rowsInven[0].stock < 1) {
                        unkownError = false;
                        throw Response.no("product out of stock", {
                            'product_id': item.product_id
                        }, response);
                    } else if (rowsInven[0].stock < item.quantity) {
                        unkownError = false;
                        throw Response.no("product not enough stock for order", {
                            'product_id': item.product_id
                        }, response);
                    }

                    // Set item to order
                    var queryOrderItems = await OrderItemsModel.setOrderItem(connection, rowsOrder[0].order_id, item.product_id, item.price, item.quantity, item.discount);
                    if (!queryOrderItems.success) throw queryOrderItems.response;

                    // Update stock
                    var queryInven = await InventoryModel.updateInventory(connection, item.product_id, (Number(rowsInven[0].stock) - Number(item.quantity)), rowsInven[0].type, rowsInven[0].description);
                    if (!queryInven.success) throw queryInven.response;

                    total_item_price = (Number(item.price) * Number(item.quantity)) * (100 - Number(item.discount)) / 100;
                    total_order_price += total_item_price;
                });

                // round total price to 2 decimal
                total_order_price = (Math.round(total_order_price * 100) / 100).toFixed(2);

                // Update order total price
                var queryOrder = await OrdersModel.updateOrder(connection, 'total_price', total_order_price, rowsOrder[0].order_id);
                if (!queryOrder.success) throw queryOrder.response;

                await connection.commit();
                await connection.release();

                data = {
                    'order_id': rowsOrder[0].order_id,
                    'total_order_price': total_order_price
                }
                Response.ok("add invoice success", data, response);
            } catch (ex) {
                //console.log(ex)
                await connection.rollback();
                await connection.release();
                console.log("rollback success")
                if (unkownError) {
                    next(ex);
                }
            }
        } else {
            next(new Error('INVC02'));
        }
    },
};