const PoolConnection = require('../config/pool');
const Response = require('../middleware/res');
const ViewsModel = require('../models/views')
const ProductModel = require('../models/products')
const categoryModel = require('../models/category')

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
                // Get pool connection
                var connection = await PoolConnection.get();
    
                // Get product
                var queryProduct = await ViewsModel.getProduct(connection, 'id', product_id);
                if (!queryProduct.success) throw queryProduct.response;
                var rowsProduct = queryProduct.response;
    
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
            // Get pool connection
            var connection = await PoolConnection.get();

            // Get all products
            var queryProduct = await ViewsModel.getAllProducts(connection);
            if (!queryProduct.success) throw queryProduct.response;
            var rowsProducts = queryProduct.response;

            Response.ok("get all products success", rowsProducts, response);
        } catch (ex) {
            //console.log(ex)
            next(ex);
        }
    },
    getAllCategories: async function (request, response, next) {
        try {
            // Get pool connection
            var connection = await PoolConnection.get();

            // Get all categories
            var queryCategory = await categoryModel.getAllCategories(connection);
            if (!queryCategory.success) throw queryCategory.response;
            var rowsCategory = queryCategory.response;

            Response.ok("get all categories success", rowsCategory, response);
        } catch (ex) {
            //console.log(ex)
            next(ex);
        }
    },
    addProduct: async function (request, response, next) {
        const {
            category_id,
            name,
            type,
            description,
            supplier,
            price
        } = request.body;

        if (category_id && name && price) {
            try {
                // Get pool connection
                var connection = await PoolConnection.get();

                // Add product
                var queryProduct = await ProductModel.setProduct(connection, category_id, name, type, description, supplier, price);
                if (!queryProduct.success) throw queryProduct.response;

                Response.ok("add product success", data, response);
            } catch (ex) {
                //console.log(ex)
                next(ex);
            }
        } else {
            next(new Error('ITEM02'));
        }
    },
};