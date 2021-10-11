const PoolConnection = require('../config/pool');
const Password = require('../middleware/Password');
const Response = require('../middleware/res');
const AccountModel = require('../models/Account')

module.exports = {
    register: async function (request, response, next) {
        const {
            username,
            password
        } = request.body;

        if (username && password) {
            try {
                // Get pool connection
                var connection = await PoolConnection.get();

                // Check duplicate username
                var queryAccount = await AccountModel.getAccount(connection, 'username', username);
                if (!queryAccount.success) throw queryAccount.response;
                if (queryAccount.response.length > 0) throw new Error(`REG02`);

                // Insert account
                var hash = await Password.encrypt(password);
                var queryInsertAccount = await AccountModel.setAccount(connection, username, hash);
                if (!queryInsertAccount.success) throw queryInsertAccount.response;

                data = { 'username': username }
                Response.ok("register success", data, response);
            } catch (ex) {
                //console.log(ex)
                next(ex);
            }
        } else {
            next(new Error('REG01'));
        }
    },
    login: async function (request, response, next) {
        const {
            username,
            password
        } = request.body;

        if (username && password) {
            try {
                // Get pool connection
                var connection = await PoolConnection.get();

                // Check username
                var queryAccount = await AccountModel.getAccount(connection, 'username', username);
                if (!queryAccount.success) throw queryAccount.response;
                if (queryAccount.response.length < 1) throw new Error(`AUTH01`);
                var rowsAccount = queryAccount.response;

                // Check password
                var resultCompare = await Password.compare(password, rowsAccount[0].password);
                if (!resultCompare) throw new Error(`AUTH02`);

                data = { 'username': username }
                Response.ok("login success", data, response);
            } catch (ex) {
                //console.log(ex)
                next(ex);
            }
        } else {
            next(new Error(`AUTH03`));
        }
    },
};