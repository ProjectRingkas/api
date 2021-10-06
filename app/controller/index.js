const Response = require('../middleware/res');

exports.index = function (req, res) {
    Response.ok("welcome to ringkas rest-api", null, res);
};