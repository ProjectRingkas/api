const PoolConnection = require('../config/pool');
const Response = require('../middleware/res');
const CustomersModel = require('../models/customers')
const VenorsModel = require('../models/vendors')

module.exports = {
    getAllCustomers: async function (request, response, next) {
        try {
            // Get pool connection
            var connection = await PoolConnection.get();

            // Get all customers
            var queryCustomers = await CustomersModel.getAllCustomers(connection);
            if (!queryCustomers.success) throw queryCustomers.response;
            var rowsCustomers = queryCustomers.response;

            Response.ok("get all customer success", rowsCustomers, response);
        } catch (ex) {
            //console.log(ex)
            next(ex);
        }
    },
    getAllVendors: async function (request, response, next) {
        try {
            // Get pool connection
            var connection = await PoolConnection.get();

            // Get all vendors
            var queryVendors = await VenorsModel.getAllVendors(connection);
            if (!queryVendors.success) throw queryVendors.response;
            var rowsVendors = queryVendors.response; 

            Response.ok("get all vendors success", rowsVendors, response);
        } catch (ex) {
            //console.log(ex)
            next(ex);
        }
    },
    addCustomer: async function (request, response, next) {
        const {
            name,
            address,
            phone,
            description
        } = request.body;

        if (name && address && phone) {
            try {
                // Get pool connection
                var connection = await PoolConnection.get();

                //  Add customer
                var queryCustomers = await CustomersModel.setCustomer(connection, name, address, phone, description);
                if (!queryCustomers.success) throw queryCustomers.response; 

                data = { 
                    'name': name,
                    'address': address,
                    'phone': phone,
                    'description': description
                }
                Response.ok("add customer success", data, response);
            } catch (ex) {
                //console.log(ex)
                next(ex);
            }
        } else {
            next(new Error('PRSN01'));
        }
    },
    addVendor: async function (request, response, next) {
        const {
            name,
            address,
            phone,
            description
        } = request.body;

        if (name && address && phone) {
            try {
                // Get pool connection
                var connection = await PoolConnection.get();

                // Addvendor
                var queryVendors = await VenorsModel.setVendor(connection, name, address, phone, description);
                if (!queryVendors.success) throw queryVendors.response;

                data = { 
                    'name': name,
                    'address': address,
                    'phone': phone,
                    'description': description
                }
                Response.ok("add vendor success", data, response);
            } catch (ex) {
                //console.log(ex)
                next(ex);
            }
        } else {
            next(new Error('PRSN02'));
        }
    },
};