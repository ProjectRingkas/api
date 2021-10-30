const PoolConnection = require('../config/pool');
const Response = require('../middleware/res');
const ViewsModel = require('../models/views')
const ProductModel = require('../models/products')
const CategoryModel = require('../models/category')
const InventoryModel = require('../models/inventory')

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
    getAllProductsByType: async function (request, response, next) {
        var {
            type
        } = request.query;
        if (!type) {
            var {
                type
            } = request.body;
        }

        if (type) {
            try {
                // Get pool connection
                var connection = await PoolConnection.get();
    
                // Get all products by type
                var queryProduct = await ProductModel.getProduct(connection, 'type', type);
                if (!queryProduct.success) throw queryProduct.response;
                var rowsProducts = queryProduct.response;
    
                Response.ok("get all products success", rowsProducts, response);
            } catch (ex) {
                //console.log(ex)
                next(ex);
            }
        } else {
            next(new Error('ITEM01'));
        }
    },
    getAllCategories: async function (request, response, next) {
        try {
            // Get pool connection
            var connection = await PoolConnection.get();

            // Get all categories
            var queryCategory = await CategoryModel.getAllCategories(connection);
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
            product_type,
            product_description,
            supplier,
            price,
            stock,
            limit_stock,
            inventory_type,
            inventory_description
        } = request.body;

        if (category_id && name && price && stock && limit_stock) {
            try {
                // Get pool connection
                var connection = await PoolConnection.getConnection();
                await connection.beginTransaction();

                // Add product
                var queryProduct = await ProductModel.setProduct(connection, category_id, name, product_type, product_description, supplier, price);
                if (!queryProduct.success) throw queryProduct.response;
                var rowsProduct = queryProduct.response;

                // Set inventoey
                var queryInventory = await InventoryModel.setInventory(connection, rowsProduct[0].product_id, stock, limit_stock, inventory_type, inventory_description);
                if (!queryInventory.success) throw queryInventory.response;

                await connection.commit();
                await connection.release();

                data = { 
                    'product_id': rowsProduct[0].product_id,
                    'name': name
                }
                Response.ok("add product success", data, response);
            } catch (ex) {
                //console.log(ex)
                await connection.rollback();
                await connection.release();
                console.log("rollback success")
                next(ex);
            }
        } else {
            next(new Error('ITEM02'));
        }
    },
    updateStock: async function (request, response, next) {
        const {
            product_id,
            stock,
            type,
            description,
        } = request.body;

        if (product_id && stock) {
            try {
                // Get pool connection
                var connection = await PoolConnection.get();

                // Update inventory
                var queryInventory = await InventoryModel.updateInventory(connection, product_id, stock, type, description);
                if (!queryInventory.success) throw queryInventory.response;

                data = { 
                    'product_id': product_id,
                    'stock': stock,
                    'type': type,
                    'description': description
                }
                Response.ok("update inventory success", data, response);
            } catch (ex) {
                //console.log(ex)
                next(ex);
            }
        } else {
            next(new Error('ITEM03'));
        }
    },
};