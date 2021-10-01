const DBConnection = require('../config/connection');
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
                // Check connection
                var checkConnection = await DBConnection.start();
                if (!checkConnection) throw new Error(`DB01`);

                // Check duplicate email
                var queryAccount = await AccountModel.getAccountUser('username', username);
                if (!queryAccount.success) throw queryAccount.response;
                if (queryAccount.response.length > 0) throw new Error(`REG02`);

                // Insert account
                var hash = await Password.encrypt(password);
                var queryInsertAccount = await AccountModel.setAccount(username, hash);
                if (!queryInsertAccount.success) throw queryInsertAccount.response;
                
                // Commit
                checkConnection = await DBConnection.commit();
                if (!checkConnection) throw new Error(`DB01`);   

                data = { 'username': username }
                Response.ok("succesfully register", data, response);
            } catch (ex) {
                //console.log(ex)
                next(ex);
            }
        } else {
            next(new Error('REG01'));
        }
    },
};