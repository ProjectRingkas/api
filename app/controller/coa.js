const PoolConnection = require('../config/pool');
const Response = require('../middleware/res');
const COAModel = require('../models/codeOfAccount')

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}


module.exports = {
    getAllCOA: async function (request, response, next) {
        try {
            // Get pool connection
            var connection = await PoolConnection.get();

            // Get all customers
            var queryCOA = await COAModel.getAllCOAs(connection);
            if (!queryCOA.success) throw queryCOA.response;
            var rowsCOA = queryCOA.response;

            Response.ok("get all code of account success", rowsCOA, response);
        } catch (ex) {
            //console.log(ex)
            next(ex);
        }
    },
    getCOAByCategory: async function (request, response, next) {
        var {
            type,
            value
        } = request.query;
        if (!type) {
            var {
                type,
                value
            } = request.body;
        }

        if (value) {
            try {
                // Get pool connection
                var connection = await PoolConnection.get();

                // Get all customers
                var queryCOA = await COAModel.getCOA(connection, type, value.toUpperCase());
                if (!queryCOA.success) throw queryCOA.response;
                var rowsCOA = queryCOA.response;

                Response.ok("get code of account success", rowsCOA, response);
            } catch (ex) {
                //console.log(ex)
                next(ex);
            }
        } else {
            next(new Error('COA01'));
        }
    },
};