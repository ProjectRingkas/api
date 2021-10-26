const PoolConnection = require('../config/pool');
const Response = require('../middleware/res');
const BillsModel = require('../models/bills')
const BillItemsModel = require('../models/billItems')
const ViewsModel = require('../models/views')
const TransactionModel = require('../models/transaction');

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}


module.exports = {
    getBill: async function (request, response, next) {
        var {
            bill_id
        } = request.query;
        if (!bill_id) {
            var {
                bill_id
            } = request.body;
        }

        if (bill_id) {
            try {
                // Get pool connection
                var connection = await PoolConnection.get();
    
                // Get bill
                var queryBill = await BillsModel.getBill(connection, 'id', bill_id);
                if (!queryBill.success) throw queryBill.response;
                if (queryBill.response.length <= 0) throw new Error('BILL01');
                var rowsBill = queryBill.response;

                // Get bill Item
                var queryBillItem = await ViewsModel.getBillItems(connection, 'bill_id', bill_id);
                if (!queryBillItem.success) throw queryBillItem.response;
                var rowsBillItem = queryBillItem.response;

                // Merge items to bill
                rowsBill[0].bill_item = rowsBillItem;

                // If there is payment for the bill
                var queryTransc = await TransactionModel.getTransaction(connection, 'bills', bill_id);
                if (!queryTransc.success) throw queryTransc.response;
                var rowsTransc = queryTransc.response;
                if (rowsTransc.length > 1)
                {
                    // Merge payment to order
                    rowsBill[0].transaction_detail = rowsTransc;
                }
    
                Response.ok("get bill success", rowsBill, response);
            } catch (ex) {
                //console.log(ex)
                next(ex);
            }
        } else {
            next(new Error('BILL01'));
        }
    },
    getAllBills: async function (request, response, next) {
        try {
            // Get pool connection
            var connection = await PoolConnection.get();

            // Get bill
            var queryBill = await BillsModel.getAllBills(connection);
            if (!queryBill.success) throw queryBill.response;
            var rowsBill = queryBill.response;

            var arrayBills = [];

            await asyncForEach(rowsBill, async function (bill) {
                // Get bill Item
                var queryBillItem = await ViewsModel.getBillItems(connection, 'bill_id', bill.id);
                if (!queryBillItem.success) throw queryBillItem.response;
                var rowsBillItem = queryBillItem.response;

                // Merge items to bill
                bill.bill_item = rowsBillItem;

                // If there is payment for the bill
                var queryTransc = await TransactionModel.getTransaction(connection, 'bills', bill.id);
                if (!queryTransc.success) throw queryTransc.response;
                var rowsTransc = queryTransc.response;
                if (rowsTransc.length > 1)
                {
                    // Merge payment to bill
                    bill.transaction_detail = rowsTransc;
                }

                arrayBills.push({
                    bill
                });
            });
            
            Response.ok("get all bill success", arrayBills, response);
        } catch (ex) {
            //console.log(ex)
            next(ex);
        }
    },
    addBill: async function (request, response, next) {
        const {
            vendor_id,
            date, 
            type,
            periodic,
            description,
            product_id,
            transaction_price,
            quantity,
            discount
        } = request.body;

        if (!(vendor_id && date && periodic && product_id && transaction_price && transaction_price && discount)) {
            next(new Error('BILL02'));
        } else if (!(periodic == "month" || periodic == "year")) {
            next(new Error('BILL03'));
        } else {
            try {
                // Get pool connection
                var connection = await PoolConnection.getConnection();
                await connection.beginTransaction();

                // Add Bill
                var status = "Pending"
                var queryBill = await BillsModel.setBill(connection, vendor_id, periodic, type, description, date, status);
                if (!queryBill.success) throw queryBill.response;
                var rowsBill = queryBill.response;

                // Set bill Item
                var queryBillItem = await BillItemsModel.setBillItem(connection, rowsBill[0].bill_id, product_id, transaction_price, quantity, discount);
                if (!queryBillItem.success) throw queryBillItem.response;

                // Calculate total price
                total_item_price = (Number(transaction_price) * Number(quantity)) * (100 - Number(discount)) / 100;

                // round total price to 2 decimal
                total_item_price = (Math.round(total_item_price * 100) / 100).toFixed(2);

                await connection.commit();
                await connection.release();

                data = { 
                    'bill_id': rowsBill[0].bill_id,
                    'total_bill_price': total_item_price
                }
                Response.ok("add bill success", data, response);
            } catch (ex) {
                //console.log(ex)
                await connection.rollback();
                await connection.release();
                console.log("rollback success")
                next(ex);
            }
        }
    },
};