const PoolConnection = require('../config/pool');
const Response = require('../middleware/res');
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
    addOrder: async function (request, response, next) {
        const {
            customer_id,
            items,
            description
        } = request.body;

        if (customer_id && items) {
            try {
                // Get pool connection
                var connection = await PoolConnection.getConnection();
                await connection.beginTransaction();

                // Add Order
                var date = new Date();
                var status = "Pending"
                var queryOrder = await OrdersModel.setOrder(connection, customer_id, description, date, status);
                if (!queryOrder.success) throw queryOrder.response;
                var rowsOrder = queryOrder.response;

                // Parse items json
                var arrayItems = JSON.parse(items);

                // Set Order Items
                var total_order_price = 0;
                await asyncForEach(arrayItems, async function (item) {
                    // Check Item stock
                    var queryInven = await InventoryModel.getInventory(connection, 'product_id', item.product_id);
                    if (!queryInven.success) throw queryInven.response;
                    var rowsInven = queryInven.response;
                    if (rowsInven[0].stock < 1) {
                        throw Response.no("product out of stock", { 'product_id': item.product_id  }, response);
                    } else if (rowsInven[0].stock < item.quantity) {
                        throw Response.no("product not enough stock for order", { 'product_id': item.product_id  }, response);
                    }

                    // Set item to order
                    var queryOrderItems = await OrderItemsModel.setOrderItem(connection, rowsOrder[0].order_id, item.product_id, item.transaction_price, item.quantity, item.discount);
                    if (!queryOrderItems.success) throw queryOrderItems.response;

                    // Update stock
                    var queryInven = await InventoryModel.updateInventory(connection, item.product_id, (Number(rowsInven[0].stock) - Number(item.quantity)), rowsInven[0].type, rowsInven[0].description);
                    if (!queryInven.success) throw queryInven.response;

                    total_item_price = (Number(item.transaction_price) * Number(item.quantity)) * (100 - Number(item.discount)) / 100;
                    total_order_price += total_item_price;
                });

                await connection.commit();
                await connection.release();

                data = { 
                    'order_id': rowsOrder[0].order_id,
                    'total_order_price': (Math.round(total_order_price * 100) / 100).toFixed(2)
                }
                Response.ok("add invoice success", data, response);
            } catch (ex) {
                //console.log(ex)
                await connection.rollback();
                await connection.release();
                console.log("rollback success")
                next(ex);
            }
        } else {
            next(new Error('INVC02'));
        }
    },
    addPayment: async function (request, response, next) {
        const {
            category_id,
            name,
            product_type,
            product_description,
            supplier,
            price,
            stock,
            limit_stock,
            inventory_type,
            inventory_description
        } = request.body;

        if (category_id && name && price && stock && limit_stock) {
            try {
                // Get pool connection
                var connection = await PoolConnection.getConnection();
                await connection.beginTransaction();

                // Add product
                var queryProduct = await ProductModel.setProduct(connection, category_id, name, product_type, product_description, supplier, price);
                if (!queryProduct.success) throw queryProduct.response;
                var rowsProduct = queryProduct.response;

                // Set inventoey
                var queryInventory = await InventoryModel.setInventory(connection, rowsProduct[0].product_id, stock, limit_stock, inventory_type, inventory_description);
                if (!queryInventory.success) throw queryInventory.response;

                await connection.commit();
                await connection.release();

                data = { 
                    'product_id': rowsProduct[0].product_id,
                    'name': name
                }
                Response.ok("add product success", data, response);
            } catch (ex) {
                //console.log(ex)
                await connection.rollback();
                await connection.release();
                console.log("rollback success")
                next(ex);
            }
        } else {
            next(new Error('ITEM02'));
        }
    },
};