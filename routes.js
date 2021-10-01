module.exports = function (router) {
    var index = require('./app/controller/index');
    var auth = require('./app/controller/authentication');

    // index
    router.get('/', index.index);

    // account
    router.post('/register', auth.register);
    // sale transaction
    // bill transaction
}