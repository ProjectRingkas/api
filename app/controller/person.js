const DBConnection = require('../config/connection');
const Response = require('../middleware/res');
const CustomersModel = require('../models/customers')
const VenorsModel = require('../models/vendors')

module.exports = {
    getAllCustomers: async function (request, response, next) {
        try {
            // Check connection
            var checkConnection = await DBConnection.start();
            if (!checkConnection) throw new Error(`DB01`);

            // Get all customers
            var queryCustomers = await CustomersModel.getAllCustomers();
            if (!queryCustomers.success) throw queryCustomers.response;
            var rowsCustomers = queryCustomers.response;
            
            // Commit
            checkConnection = await DBConnection.commit();
            if (!checkConnection) throw new Error(`DB01`);   

            Response.ok("get all customer success", rowsCustomers, response);
        } catch (ex) {
            //console.log(ex)
            next(ex);
        }
    },
    getAllVendors: async function (request, response, next) {
        try {
            // Check connection
            var checkConnection = await DBConnection.start();
            if (!checkConnection) throw new Error(`DB01`);

            // Get all vendors
            var queryVendors = await VenorsModel.getAllVendors();
            if (!queryVendors.success) throw queryVendors.response;
            var rowsVendors = queryVendors.response;
            
            // Commit
            checkConnection = await DBConnection.commit();
            if (!checkConnection) throw new Error(`DB01`);   

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
                // Check connection
                var checkConnection = await DBConnection.start();
                if (!checkConnection) throw new Error(`DB01`);

                //  Add customer
                var queryCustomers = await CustomersModel.setCustomer(name, address, phone, description);
                if (!queryCustomers.success) throw queryCustomers.response;
                
                // Commit
                checkConnection = await DBConnection.commit();
                if (!checkConnection) throw new Error(`DB01`);   

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
                // Check connection
                var checkConnection = await DBConnection.start();
                if (!checkConnection) throw new Error(`DB01`);

                // Addvendor
                var queryVendors = await VenorsModel.setVendor(name, address, phone, description);
                if (!queryVendors.success) throw queryVendors.response;
                
                // Commit
                checkConnection = await DBConnection.commit();
                if (!checkConnection) throw new Error(`DB01`);   

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