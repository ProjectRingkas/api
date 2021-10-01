const Response = require('../middleware/res');

exports.index = function (req, res) {
    Response.ok("Welcome to Remitance Rest-API.", null, res);
};