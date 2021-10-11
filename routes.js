module.exports = function (router) {
    const Index = require('./app/controller/index');
    const Auth = require('./app/controller/authentication');
    const Person = require('./app/controller/person');
    const Item = require('./app/controller/item');
    const Invoice = require('./app/controller/invoice'); 
    const Report = require('./app/controller/report'); 

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
    router.post('/items/add', Item.addProduct);
    router.put('/items/inventory/update', Item.updateStock);
    router.get('/items/categories/getall', Item.getAllCategories);

    // sale transaction
    router.get('/invoice/get', Invoice.getOrder);
    router.get('/invoice/getall', Invoice.getAllOrders);
    router.post('/invoice/add', Invoice.addOrder);

    // bill transaction

    // report
    router.get('/report/products/getall', Report.getAllProductsReport);
}