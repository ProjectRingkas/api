module.exports = function (router) {
    const Index = require('./app/controller/index');
    const Auth = require('./app/controller/authentication');
    const Person = require('./app/controller/person');
    const Item = require('./app/controller/item');
    const Invoice = require('./app/controller/invoice');
    const Bill = require('./app/controller/bill');
    const Payment = require('./app/controller/payment');
    const Report = require('./app/controller/report');
    const COA = require('./app/controller/coa');

    // index
    router.get('/', Index.index);

    // account
    router.post('/register', Auth.register);
    router.post('/login', Auth.login);

    // person
    router.post('/customers/add', Person.addCustomer);
    router.get('/customers/getall', Person.getAllCustomers);
    router.post('/vendors/add', Person.addVendor);
    router.get('/vendors/getall', Person.getAllVendors);

    // items
    router.get('/items/get', Item.getProduct);
    router.get('/items/getall', Item.getAllProducts);
    router.get('/items/type', Item.getAllProductsByType);
    router.post('/items/add', Item.addProduct);
    router.put('/items/inventory/update', Item.updateStock);
    router.get('/items/categories/getall', Item.getAllCategories);

    // code of account
    router.get('/coa/getall', COA.getAllCOA);
    router.get('/coa/getByCategory', COA.getCOAByCategory);

    // sale transaction
    router.get('/invoice/get', Invoice.getOrder);
    router.get('/invoice/getall', Invoice.getAllOrders);
    router.post('/invoice/add', Invoice.addOrder);

    // bill transaction
    router.get('/bill/get', Bill.getBill);
    router.get('/bill/getall', Bill.getAllBills);
    router.post('/bill/add', Bill.addBill);

    // payment
    router.post('/payment/add', Payment.addPayment);
    router.get('/payment/get', Payment.getPayment);

    // report
    router.get('/report/products/getall', Report.getAllProductsReport);
    router.get('/report/payments/getall', Report.getAllPaymentsReport);
    router.get('/report/payments/filter', Report.getFilteredPaymentsReport);
}