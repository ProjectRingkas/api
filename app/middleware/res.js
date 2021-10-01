exports.ok = function (msg, values, res) {
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

    res.json(data);
    res.end();
}