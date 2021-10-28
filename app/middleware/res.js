module.exports = {
    ok: function (msg, values, res) {
        var data = {
            'status': 200,
            'message': msg,
            'data': values
        };
        if (!values) {
            var data = {
                'status': 200,
                'message': msg
            };
        }
        res.status(200);
        res.json(data);
        res.end();
    },
    no: function (msg, values, res) {
        var data = {
            'status': 400,
            'message': msg,
            'data': values
        };
        if (!values) {
            var data = {
                'status': 400,
                'message': msg
            };
        }
        res.status(400);
        res.json(data);
        res.end();
    }
};