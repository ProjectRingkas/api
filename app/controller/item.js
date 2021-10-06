const DBConnection = require('../config/connection');
const Response = require('../middleware/res');
const ProductModel = require('../models/products')

module.exports = {
    getProduct: async function (request, response, next) {
        var {
            product_id
        } = request.query;
        if (!product_id) {
            var {
                product_id
            } = request.body;
        }

        // Check product id
        if (product_id) {
            try {
                // Check connection
                var checkConnection = await DBConnection.start();
                if (!checkConnection) throw new Error(`DB01`);
    
                // Get product
                var queryProduct = await ProductModel.getProduct('id', product_id);
                if (!queryProduct.success) throw queryProduct.response;
                var rowsProduct = queryProduct.response;
                
                // Commit
                checkConnection = await DBConnection.commit();
                if (!checkConnection) throw new Error(`DB01`);   
    
                Response.ok("get product success", rowsProduct, response);
            } catch (ex) {
                //console.log(ex)
                next(ex);
            }
        } else {
            next(new Error('ITEM01'));
        }
    },
    getAllProducts: async function (request, response, next) {
        try {
            // Check connection
            var checkConnection = await DBConnection.start();
            if (!checkConnection) throw new Error(`DB01`);

            // Insert account
            var queryProduct = await ProductModel.getAllProducts();
            if (!queryProduct.success) throw queryProduct.response;
            var rowsProducts = queryProduct.response;
            
            // Commit
            checkConnection = await DBConnection.commit();
            if (!checkConnection) throw new Error(`DB01`);   

            Response.ok("get all products success", rowsProducts, response);
        } catch (ex) {
            //console.log(ex)
            next(ex);
        }
    },
};