module.exports = function (router) {
    const Index = require('./app/controller/index');
    const Auth = require('./app/controller/authentication');
    const Person = require('./app/controller/person');
    const Item = require('./app/controller/item');

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

    // sale transaction
    // bill transaction
}